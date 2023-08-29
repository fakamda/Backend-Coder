import { promises as fs, read } from "fs";
import ProductManager from "./productManager.js";

const allProducts = new ProductManager();

class CartManager {
  #carts;
  constructor() {
    this.#carts = [];
    this.path = "./src/models/carts.json";
    this.format = "utf-8";
  }

  readCarts = async () => {
    try {
      const carts = await fs.readFile(this.path, this.format);
      return JSON.parse(carts);
    } catch (err) {
      throw new Error(`Error to read the carts ${err}`);
    }
  };

  writeCarts = async (cart) => {
    await fs.writeFile(this.path, JSON.stringify(cart, null, "\t"));
  };

  existCarts = async (id) => {
    let carts = await this.readCarts();
    return carts.find((cart) => cart.id == id);
  };

  #generateCartId = () => {
    if (this.#carts.length === 0) {
      return 1;
    } else {
      let lastCart = this.#carts[this.#carts.length - 1];
      return lastCart.id + 1;
    }
  };

  getCartById = async (id) => {
    let cartById = await this.existCarts(id);
    if (!cartById) return "Cart Not Found";
    return cartById;
  };

  addCarts = async (cart) => {
    const oldCarts = await this.readCarts();

    const newCart = {
      id: this.#generateCartId(),
      products: [], // Nuevo array de productos vacío
      ...cart,
    };

    const allCarts = [...oldCarts, newCart];

    this.#carts.push(newCart);

    await this.writeCarts(allCarts);

    if (!newCart) return "The cart cannot be added";
    return "Cart added successfully.";
  };

  addProductsToCart = async (cartId, productId) => {
    let cartById = await this.existCarts(cartId) // comprobamos si xiste el id
    if(!cartById) return "Cart Not Found"
    let productById = await allProducts.existProducts(productId)
    if(!productById) return "Product Not Found"
    let allCarts = await this.readCarts() //hacemos la lectura de todos los carts
    let cartFilter = allCarts.filter((cart) => cart.id != cartId)
    // some para filtrar si alguno de los productos cuyo id sea el filtrado coincide para poder sumarle la cantidad
    if(cartById.products.some(prod => prod.id == productId)){
      // el find nos devuelve el objeto que esta dentro
      let moreProductInCart = cartById.products.find(prod => prod.id == productId) // una vez lo encontramos le sumamos 1 a la quantity
      moreProductInCart.quantity++

      let cartConcat = [cartById, ...cartFilter] // nos traemos el objeto con la cantidad modificada, y los productos anteriores.
      await this.writeCarts(cartConcat)
      return "Product Added +1 To Cart."
    }

    cartById.products.push({id: productById.id, quantity: 1})
    let cartConcat = [cartById, ...cartFilter] 
    await this.writeCarts(cartConcat)
    return "Product Added To Cart."
  }

  deleteProductFromCart = async (cartId, productId) => {
    const cart = await this.getCartById(cartId);
    const index = cart.products.findIndex((product) => product.id === productId)

    if (index !== -1) {
      cart.products.splice(index, 1);

      const carts = await this.readCarts();

      const cartIndex = carts.findIndex((i) => {
        return i.id == cart.id;
      });

      carts[cartIndex] = cart;
      await this.writeCarts(carts)
      
    } else {
      throw new Error("Product not found");
    }
  };
}

export default CartManager;
