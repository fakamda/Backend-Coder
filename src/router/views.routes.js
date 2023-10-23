import { Router } from "express";
import { cartViewController, chatViewController, productsViewController, realTimeProductsViewController } from "../controllers/views.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";


const router = Router()

router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), productsViewController)
router.get("/realtimeproducts", handlePolicies(["ADMIN", "USER", "PUBLIC"]), realTimeProductsViewController)
router.get("/chat", handlePolicies(["ADMIN", "USER"]), chatViewController)
router.get('/carts/:cid', handlePolicies(["ADMIN", "USER"]), cartViewController)

router.get('/forget-password', (req, res) => {
    res.render('sessions/forget-password')
})

router.get('/reset-password/:token', (req, res) => {
    res.redirect(`/api/sessions/verify-token/${req.params.token}`)
})



export default router
