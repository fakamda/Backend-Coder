import { Router } from "express";
import productModel from "../models/product.model.js";
import messageModel from "../models/chat.model.js";

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

router.get("/chat", async (req, res) => {
  try {
    const messages = await messageModel.find().lean().exec();
    res.render("chat", { messages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

// router.get('/chat', (req, res) => {
//   res.render('chat', {})
// })

export default router
