import { Router } from "express"
import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"

const router = Router()

router.post("/", async (req, res) => {
    try {
      const cart = req.body
      const addCart = await cartModel.create(cart)
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

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }
    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );
    const result = await cart.save();
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedProducts = req.body.products;
    const cart = await cartModel.findById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }
    cart.products = updatedProducts;
    const result = await cart.save();
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
});

// router.put("/:cid/products/:pid", async (req, res) => {
//   try{
//   "status": "success",
//   "payload": {
//     "_id": "cartId",
//     "products": [
//       {
//         "_id": "productId1",
//         "product": {
//           "_id": "productId1",
//           "name": "Product 1",
//           "price": 10.99
//         },
//         "quantity": 5
//       },
//       {
//         "_id": "productId2",
//         "product": {
//           "_id": "productId2",
//           "name": "Product 2",
//           "price": 20.99
//         },
//         "quantity": 3
//       }
//     ]
//   }
// }


  
  
  export default router