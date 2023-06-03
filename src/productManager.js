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

  writeProducts = async (product) => {
    await fs.writeFile(this.path, JSON.stringify(product, null, '\t'))
  }

  getProducts = async () => {
    try {
      return await this.readProducts()
    }catch (err) {
      console.error(`Error al buscar los productos ${err}`)
    }

  };

  #generateId = () =>  this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1;

  getProductById = async (id) => {
    const res = await this.readProducts()
    const product = res.find( prod => prod.id === id)

    if (!product) return "Not Found";
    return product;
  };

  // id: this.#generateId(),

  addProduct = async (product) => {
    const newProduct = {
      id: this.#generateId(), ...product
    };

    this.#products.push(newProduct);

    const jsonContent = JSON.stringify(this.#products, null, '\t');

    try {
      await fs.writeFile(this.path, jsonContent);
      return "Product added successfully."
    } catch (err) {
      throw new Error(`Error writing to JSON file: ${err}`);
    }
  };

  // await fs.writeFile(this.path, JSON.stringify(prodFilter, null, '\t'));
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

  updateProduct = async ({id, ...prod}) => {
    await this.deleteProduct(id)
    let product = await this.readProducts()
    let newProd = [
      {id, ...prod},...product
    ]
    await fs.writeFile(this.path, JSON.stringify(newProd, null, '\t'));
    
  }

}