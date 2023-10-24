import { Router } from "express";
import { cartViewController, chatViewController, productsViewController, realTimeProductsViewController } from "../controllers/views.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";


const router = Router()

router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), productsViewController)
router.get("/realtimeproducts", handlePolicies(["ADMIN", "USER", "PUBLIC"]), realTimeProductsViewController)
router.get("/chat", handlePolicies(["ADMIN", "USER"]), chatViewController)
router.get('/carts/:cid', handlePolicies(["ADMIN", "USER"]), cartViewController)

export default router
