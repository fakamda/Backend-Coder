import { Router } from "express"
import { uploaders } from "../middlewares/multer.middleware.js"
import { createProductController, deleteProductController, getProductByIdController, getProductsController, getProductsWithLimit, updateProductController } from "../controllers/product.controller.js"
import { handlePolicies } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductsController)
router.get("/", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductsWithLimit)
router.get("/:pid", handlePolicies(["ADMIN", "USER", "PUBLIC"]), getProductByIdController)
// router.post("/", handlePolicies(["ADMIN", "PREMIUM"]), uploaders, createProductController)
router.post("/", handlePolicies(["ADMIN", "PREMIUM", "PUBLIC"]), uploaders, createProductController)
router.put("/:pid", handlePolicies(["ADMIN"]), updateProductController)
router.delete("/:pid", handlePolicies(["ADMIN"]), deleteProductController) 


export default router
