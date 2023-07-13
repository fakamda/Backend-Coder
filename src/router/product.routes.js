import { Router } from "express"
import ProductManager from "../Dao/MongoManager/ProductManagerDB.js"
import productModel from "../models/product.model.js"


const router = Router()


router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 0
    const productManager = new ProductManager()
    const products = await productManager.getProducts()
    res.status(200).json({products})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const result = await ProductManager.getProductById(productId)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
})


router.post("/", async (req, res) => {
  try {
    const product = req.body;
    const result = await ProductManager.createProduct(product)
    const products = await productModel.find().lean().exec()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
})


router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const data = req.body
    const result = await ProductManager.updateProduct(productId, data)
    const products = await productModel.find().lean().exec()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({status: "success", payload: result})
  } catch (err) {
    res.status(500).json({ status: "error", error: err.message })
  }
})



 router.delete("/:pid", async (req, res) => {
      try {
        const productId = req.params.pid;
  
        const result = await productModel
          .findByIdAndDelete(productId)
          .lean()
          .exec();
  
        if (result === null) {
          return res.status(404).json({ error: 'Not Found' });
        }
  
        const products = await productModel.find().lean().exec();
        req.app.get("socketio").emit("updatedProducts", products);
  
        res.status(200).json({ status: "success", payload: products });
      } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
      }
    })


export default router
