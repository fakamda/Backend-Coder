import { createProductController, getProductsController } from "../controllers/mock.controller.js";
import { Router } from "express";

const router = Router()

router.get("/", getProductsController)
router.post("/", createProductController)


export default router