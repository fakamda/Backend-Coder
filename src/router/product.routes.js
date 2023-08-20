import { Router } from "express"
import { createProductController, deleteProductController, getProductByIdController, getProductsController, getProductsWithLimit, updateProductController } from "../controllers/product.controller.js"

const router = Router()

router.get("/", getProductsController)
router.get("/", getProductsWithLimit)
router.get("/:pid", getProductByIdController)
router.post("/", createProductController)
router.put("/:pid", updateProductController)
router.delete("/:pid", deleteProductController) 


export default router
