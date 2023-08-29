import { promises as fs } from "fs";

export default class ProductManager {
  #products;
  constructor() {
    this.#products = [];
    this.path = "./src/models/products.json";
    this.format = "utf-8";
  }

  #validateProduct = async (product) => {
    const products = await this.getProducts()

    const existProduct = await products.find(
      (prod) => prod.code === product.code
    )
    if (existProduct !== undefined) {
      console.log("Ya existe un producto con el mismo código");
      return false;
    }

    return true;
  }

  readProducts = async () => {
    try {
      const response = await fs.readFile(this.path, this.format);
      return JSON.parse(response)
    }catch (err) {
      throw new Error(`Error al leer los productos ${err}`)
    }

  }

  writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product, null, '\t'))
  }

  existProducts = async (id) => {
    let products = await this.readProducts()
    return products.find(prod => prod.id == id)
 
  }

  getProducts = async () => {
    try {
      return await this.readProducts()
    }catch (err) {
      console.error(`Error al buscar los productos ${err}`)
    }

  }


  #generateId = (data) => {
    return (data.length === 0 ) ? 1 : data[data.length - 1].id +1
  }


  getProductById = async (id) => {
    let productById = await this.existProducts(id)
    if(!productById) return "Not Found"
    return productById

  }
  
  addProduct = async (title, description, price, thumbnail, code, category, stock) => {

    const products = await this.getProducts();

    const newProduct = {
      id: await this.#generateId(products),
      title,
      description,
      price,
      thumbnail: thumbnail || [],
      code,
      category,
      stock,
      status: true,
    }

    if (await this.#validateProduct(newProduct)) {
      products.push(newProduct)

      await this.writeProducts(products)
      this.products = products
      return newProduct

    }
  }


  deleteProduct = async (id) => {
    let product = await this.readProducts()
    let existId = product.some(prod => prod.id == id)
    if(existId) {
      let prodFilter = product.filter(prod => prod.id != id)
      await this.writeProducts(prodFilter)
      return "Producto Eliminado"
    }else {
      return "El producto a eliminar no existe"
    }
  }



  updateProduct = async (id, product) => {
    let productById = await this.existProducts(id)
    if(!productById) return "Not found"
    await this.deleteProduct(id)
    let oldProduct = await this.readProducts()
    let products = [{id : id, ...product}, ...oldProduct]
    await this.writeProducts(products)
    return "Updated product"

  }

}
   
