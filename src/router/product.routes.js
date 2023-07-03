import { Router } from "express";
import productModel from "../models/product.model.js";


const router = Router();

router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 0
    const result = await productModel.find().limit(limit).lean().exec()
    res.status(200).json({ payload: result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});


router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const result = await productModel.findById(productId).lean().exec()
    if (!result) {
      return res.status(404).json({ error: 'Not Found' })
    }
    res.status(200).json({ payload: result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});


router.post("/", async (req, res) => {
  try {
    const product = req.body
    const result = await productModel.create(product)
    const products = await productModel.find().lean().exec()
    req.app.get("socketio").emit("updatedProducts", products)
    return res.status(201).json({ payload: result })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
});

// router.put("/:pid", async (req, res) => {
//   try {
//     const productId = req.params.pid
//     const data = req.body
//     const result = await productModel.findByIdAndUpdate(productId, data, { returDocument: 'after' })
//     if (result === null) {
//       return res.status(404).json({ error: 'Not Found'})
//     }
//     const products = await productModel.find().lean().exec()
//     req.app.get("socketio").emit("updatedProducts", products)
//     res.status(200).json({ payload: result });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// })

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const data = req.body
    const result = await productModel.findByIdAndUpdate(productId, data, { new: true }).lean().exec()
    if (result === null) {
      return res.status(404).json({ error: 'Not Found' })
    }
    const products = await productModel.find().lean().exec()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({ payload: result })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid
    const result = await productModel.findByIdAndDelete(productId).lean().exec()
    if (result === null) {
      return res.status(404).json({ error: 'Not Found' })
    }
    const products = await productModel.find().lean().exec()
    req.app.get("socketio").emit("updatedProducts", products)
    res.status(200).json({ payload: products })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
