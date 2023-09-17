import { Router } from "express"
import { addProductToCartController, createCartController, getCartByIdController, getCartsController, removeProductFromCartController, updateCartController, updateProductFromCartController, purchaseCartController, getUserCartController, getBillContoller } from "../controllers/cart.controller.js";
import { handlePolicies } from "../middlewares/auth.middleware.js";

const router = Router()

router.get("/", getCartsController)
router.get("/:cid", getCartByIdController)
router.post("/", createCartController)
router.post("/:cid/product/:pid", handlePolicies(["ADMIN", "USER"]), addProductToCartController)
router.delete("/:cid/products/:pid", removeProductFromCartController)
router.put("/:cid", updateCartController)
router.put("/:cid/products/:pid", updateProductFromCartController)
router.post('/:cid/purchase', purchaseCartController)
router.get('/user/cart', getUserCartController)
router.post('/getbill', getBillContoller)
  
export default router