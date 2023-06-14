import { promises as fs } from "fs";



export default class ProductManager {
  #products;
  constructor() {
    this.#products = [];
    this.path = "./src/models/products.json";
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

  // #generateId = () =>  this.#products.length === 0 ? 1 : this.#products[this.#products.length - 1].id + 1;
  #generateId = (data) => {
    return (data.length === 0 ) ? 1 : data[data.length - 1].id +1
  }


  getProductById = async (id) => {
    let productById = await this.existProducts(id)
    if(!productById) return "Not Found"
    return productById

  }

  // aca modifique el metodo para que traiga el array viejo antes de agregar el nuevo producto, por que me estaba borrando el viejo cada vez que cargaba uno
  // no se si haya algo demas pero me funciono asi, tambien tuve varios problemas con el id dinamico jaja pero seguro hay alguna libreria para esto 

  // if(!product.title || !product.description || !product.price || !product.code || !product.stock)
  //   return '[Err] required fields missing'

  addProduct = async (product) => {
    const oldProducts = await this.readProducts();


    const newProduct = {
      id: this.#generateId(oldProducts), status:true, thumbnails: [], ...product
    }

    const allProducts = [...oldProducts, newProduct]

    this.#products.push(newProduct);

    await this.writeProducts(allProducts);

    if(!newProduct) return "The product cannot be added"
    return "Product added successfully."
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

// TANTO ESTE METODO COMO EL ANTERIOR ME COSTARON HORRORES HACERLOS FUNCIONAR PERO DESPUES DE TANTO SE PUDO JAJA

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
   
