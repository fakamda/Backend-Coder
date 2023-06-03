import express from 'express'
import ProductManager from './productManager.js';

const app = express()
app.use(express.urlencoded({ extended : true }))
app.use(express.json())

const products = new ProductManager();
// const getProducts = products.getProducts()

// GET
app.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit); 
    if (!limit) return res.send(await products.getProducts()) 
    let allProd = await products.getProducts()
    const productLimit = allProd.slice(0, limit)
    res.status(200).send(await productLimit);
});

app.get("/products/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    let allProd = await products.getProducts()
    let productById = allProd.find(prod => prod.id == id)
    res.send(productById)
})

//POST
app.post("/products", async (req, res) => {
    const newProduct = req.body
    res.status(200).send(await products.addProduct(newProduct))
})

//PUT 

app.put("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    let updateProduct = req.body
    res.status(200).send(await products.updateProduct(updateProduct))
})

// DELETE 
app.delete("/products/:id", async (req, res) => {
    let id = parseInt(req.params.id)
    res.send(await products.deleteProduct(id))
})

//SERVER

const PORT = 8080 

const server = app.listen(PORT, () => {
    console.log(`Server Up... in port ${server.address().port}`)
}) 

server.on("error", (err) => {
    console.log(`Error in the server ${err}`)
})