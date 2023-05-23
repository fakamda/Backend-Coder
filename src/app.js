import express from 'express'
import ProductManager from './productManager.js';

const app = express()
app.use(express.urlencoded({ extended : true })); // con esto permitimos que si el endpoint es extenso no tenga problema en leerlo

const products = new ProductManager();
const readProducts = products.readProducts()

// ruta relativa http://localhost:8080/products
app.get("/products", async (request, response) => {
    const limit = parseInt(request.query.limit); // le pasamos parseint para que sea un numero y no un string

    if (!limit) return response.send(await readProducts) // le indicamos que si limit no existe, muestra todos los productos, de caso contrario muestra los productos limitados
    let allProd = await readProducts
    const productLimit = allProd.slice(0, limit) // tenemos que darle el parametro de inicio y hasta donde queremos
    response.send(await productLimit);
});

app.get("/products/:pid", async (request, response) => {
    const id = (request.params.pid)
    let allProd = await readProducts
    let productById = allProd.find(prod => prod.id == id) // metodo find para filtrar las id // le damos el query params pid como dice la consigna 
    response.send(productById)
})

const PORT = 8080 //definimos el port
const server = app.listen(PORT, () => {
    console.log(`Server Up... in port ${server.address().port}`)
}) // inicializamos el server en el port 8080 y con el callback vemos si el sv se inicio o no... adress().port nos devuelve la propiedad port del server

server.on("error", (err) => {
    console.log(`Error in the server ${err}`) // reflejamos el error
})