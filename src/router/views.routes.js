import { Router } from "express";
import productModel from "../models/product.model.js";

const router = Router()

router.get("/", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec()
    res.render('home', { products })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: error.message });
  }
})

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productModel.find().lean().exec()
    res.render('realTimeProducts', { products })
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: 'error', error: error.message })
  }
})

export default router
