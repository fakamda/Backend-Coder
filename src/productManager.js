import { promises as fs } from "fs";

export default class ProductManager {
  #products;
  constructor() {
    this.#products = [];
    this.path = "../products.json";
    this.format = "utf-8";
  }

  readProducts = async () => {
    try {
      const response = await fs.readFile(this.path, this.format);
      return JSON.parse(response)
    }catch (err) {
      throw new Error(`Error al leer los productos ${err}`)
    }
   
  }

  getProducts = async () => {
    try {
      const newResponse = await this.readProducts()
      return console.log(newResponse)

    }catch (err) {
      console.error(`Error al buscar los productos ${err}`)
    }
    
  };

  #generateId = () =>  this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1;

  getProductById = async (id) => {
    const res = await this.readProducts()
    const product = res.find( prod => prod.id === id)
    console.log(product)
    if (!product) return "Not Found";
    return product;
  };

  addProduct = async (title, description, price, code, stock, thumbnail) => {
    const newProduct = {
      id: this.#generateId(),
      title,
      description,
      price,
      code,
      stock,
      thumbnail,
    };

    this.#products.push(newProduct);

    const jsonContent = JSON.stringify(this.#products, null, '\t');

    try {
      await fs.writeFile(this.path, jsonContent);
      console.log("Product added successfully.");
    } catch (err) {
      throw new Error(`Error writing to JSON file: ${err}`);
    }
  };


  deleteProduct = async (id) => {
    let response = await this.readProducts()
    let prodFilter = response.filter(prod => prod.id != id)

    await fs.writeFile(this.path, JSON.stringify(prodFilter, null, '\t'));

    console.log('Producto eliminado')
  }

  updateProduct = async ({id, ...prod}) => {
    await this.deleteProduct(id)
    let product = await this.readProducts()
    let newProd = [
      {id, ...prod},...product
    ]
    await fs.writeFile(this.path, JSON.stringify(newProd, null, '\t'));
  }
}

// const productManager = new ProductManager();

// Add products
// productManager.addProduct(
//   "Remera1",
//   "Remera Negra",
//   4400,
//   "101",
//   20,
//   "imagen1"
// );
// productManager.addProduct(
//   "Remera2",
//   "Remera Blanca",
//   4600,
//   "102",
//   22,
//   "imagen2"
// );
// productManager.addProduct(
//   "Remera3",
//   "Remera Verde",
//   4200,
//   "103",
//   22,
//   "imagen3"
// );
// productManager.addProduct(
//   "Remera4",
//   "Remera Roja",
//   4700,
//   "104",
//   22,
//   "imagen4"
// );
// productManager.addProduct(
//   "Remera5",
//   "Remera Azul",
//   4500,
//   "105",
//   22,
//   "imagen5"
// );
// productManager.addProduct(
//   "Remera6",
//   "Remera Bordo",
//   4300,
//   "106",
//   22,
//   "imagen6"
// );

//EJEMPLOS
// productManager.getProducts();
// productManager.getProductById(2)
// productManager.deleteProduct(1)

