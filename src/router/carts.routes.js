import { Router } from "express"
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
// import CartManager from '../Dao/FsManager/cartManager.js';

const router = Router()
// const carts = new CartManager

// router.get("/", async (req, res) => {
//     res.send(await carts.readCarts())
// })

// router.get("/:cid", async (req, res) => {
//     let id = parseInt(req.params.cid)
//     res.send(await carts.getCartById(id))
// })

// router.post("/", async (req, res) => {
//     res.send(await carts.addCarts())
// })

// router.post('/:cid/products/:pid', async (req, res) => {
//     let cartId = parseInt(req.params.cid)
//     let productId = parseInt(req.params.pid)

//     res.send(await carts.addProductsToCart(cartId, productId))
// })

// router.delete("/:cid/products/:pid", async (req, res) => {
//     let cartId = parseInt(req.params.cid)
//     let productId = parseInt(req.params.pid)
//     res.send(await carts.deleteProductFromCart(cartId, productId))

// })

router.post("/", async (req, res) => {
    try {
      const cart = req.body;
      const addCart = await cartModel.create(cart);
      res.json({ status: "success", payload: addCart })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", error: error.message })
    }
  })
  
  router.post("/:cid/product/:pid", async (req, res) => {
    try {
      const pid = req.params.pid;
      const product = await productModel.findById(pid)
      if (!product) {
        return res.status(404).json({ status: "error", error: error.message })
      }
      const cid = req.params.cid;
      const cart = await cartModel.findById(cid)
      if (!cart) {
        return res.status(404).json({ status: "error", error: error.message })
      }
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      )
      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1
      } else {
        const newProduct = {
          product: pid,
          quantity: 1,
        }
        cart.products.push(newProduct);
      }
      const result = await cart.save();
      res.json({ status: "success", payload: result })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ status: "error", error: error.message })
    }
  })
  
  router.get("/:cid", async (req, res) => {
    try {
      const cartId = req.params.cid
      const cart = await cartModel.findById(cartId)
      if (!cart) {
        return res
          .status(404)
          .json({ status: "error", error: error.message })
      }
      res.send(cart)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error.message })
    }
  })
  
  export default router