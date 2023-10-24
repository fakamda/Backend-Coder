import { Router } from "express"
import { createProductController, deleteProductController, getProductByIdController, getProductsController, getProductsWithLimit, updateProductController } from "../controllers/product.controller.js"
import { handlePolicies } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductsController)
router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductsWithLimit)
router.get("/:pid", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductByIdController)
router.post("/", handlePolicies(["ADMIN"]), createProductController)
// router.post("/", createProductController)
router.put("/:pid", handlePolicies(["ADMIN"]), updateProductController)
router.delete("/:pid", handlePolicies(["ADMIN"]), deleteProductController) 


export default router
