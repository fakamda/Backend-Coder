import { Router } from "express";
import { cartViewController, chatViewController, productsViewController, realTimeProductsViewController } from "../controllers/views.controller.js";


const router = Router()

router.get("/", productsViewController)
router.get("/realtimeproducts", realTimeProductsViewController)
router.get("/chat", chatViewController)
router.get('/carts/:cid', cartViewController)



export default router
