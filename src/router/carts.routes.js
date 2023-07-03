import { Router } from "express"
import CartManager from '../Dao/FsManager/cartManager.js';

const router = Router()
const carts = new CartManager

router.get("/", async (req, res) => {
    res.send(await carts.readCarts())
})

router.get("/:cid", async (req, res) => {
    let id = parseInt(req.params.cid)
    res.send(await carts.getCartById(id))
})

router.post("/", async (req, res) => {
    res.send(await carts.addCarts())
})

router.post('/:cid/products/:pid', async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)

    res.send(await carts.addProductsToCart(cartId, productId))
})

router.delete("/:cid/products/:pid", async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    res.send(await carts.deleteProductFromCart(cartId, productId))

})





export default router