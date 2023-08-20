import { Router } from "express"
import { addProductToCartController, createCartController, getCartByIdController, getCartsController, removeProductFromCartController, updateCartController, updateProductFromCartController } from "../controllers/cart.controller.js";

const router = Router()

router.get("/", getCartsController)
router.get("/:cid", getCartByIdController)
router.post("/", createCartController)
router.post("/:cid/product/:pid", addProductToCartController)
router.delete("/:cid/products/:pid", removeProductFromCartController)
router.put("/:cid", updateCartController)
router.put("/:cid/products/:pid", updateProductFromCartController)
  
  
export default router