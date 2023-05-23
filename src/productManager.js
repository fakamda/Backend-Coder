import fs from "fs";

class ProductManager {
  #products;
  constructor() {
    this.#products = [];
    this.path = "../products.json";
    this.format = "utf-8";
  }

  // leemos los productos y los parseamos de JSON. lo mismo, agregue un try catch para catchear el error, no pude encontrar la solucion
  readProducts = async () => {
    try {
      const response = await fs.promises.readFile(this.path, this.format);
      return JSON.parse(response)
    }catch (err) {
      throw new Error(`Error al leer los productos ${err}`)
    }
   
  }

  // obtenemos los productos luego de leerlos y lo leemos por consola
  //aca la realidad es que me da error de vez en cuando al ejecutar el archivo no se como podria hacer para solucionarlo.
// tampoco entiendo muy bien por que sale ese error, normalmente me dice que el archivo .json no se puede leer y da error pense en poner un try y catch para catchear el error momentaneamente
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

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.#products, null, '\t')
    );
  };

  deleteProduct = async (id) => {
    let response = await this.readProducts()
    let prodFilter = response.filter(prod => prod.id != id)

    await fs.promises.writeFile(this.path, JSON.stringify(prodFilter, null, '\t'));

    console.log('Producto eliminado')
  }

  updateProduct = async ({id, ...prod}) => {
    await this.deleteProduct(id)
    let product = await this.readProducts()
 // generamos un nuevo array para sobreescribir
    let newProd = [
      {id, ...prod},...product
    ]
    await fs.promises.writeFile(this.path, JSON.stringify(newProd, null, '\t'));
  }
}

const productManager = new ProductManager();
productManager.addProduct(
  "Remera1",
  "Remera Negra",
  4400,
  "101",
  20,
  "imagen1"
)
productManager.addProduct(
  "Remera2",
  "Remera Blanca",
  4600,
  "102",
  22,
  "imagen2"
)

//EJEMPLOS
productManager.getProducts();
productManager.getProductById(2)
productManager.deleteProduct(1)
productManager.updateProduct({
  id: 2,
  title: 'Remera2',
  description: 'Remera Blanca',
  price: 5000,
  code: '102',
  stock: 22,
  thumbnail: 'imagen2'
})
