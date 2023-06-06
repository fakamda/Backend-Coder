import { Router } from "express"
import ProductManager from '../controllers/productManager.js';

const router = Router()

const products = new ProductManager();

// GET
router.get("/", async (req, res) => {
    const limit = parseInt(req.query.limit); 
    if (!limit) return res.send(await products.getProducts()) 
    let allProd = await products.getProducts()
    const productLimit = allProd.slice(0, limit)
    res.status(200).send(await productLimit);
});

router.get("/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    res.send(await products.getProductById(id))
})

//POST
router.post("/", async (req, res) => {
    const newProduct = req.body
    res.status(200).send(await products.addProduct(newProduct))
})

//PUT 
router.put("/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    let updateProduct = req.body
    res.send(await products.updateProduct(id, updateProduct))
})

// DELETE 
router.delete("/:pid", async (req, res) => {
    let id = parseInt(req.params.pid)
    res.send(await products.deleteProduct(id))

})

export default router