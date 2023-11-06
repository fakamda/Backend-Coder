import { Router } from "express";
import { premiumUserController, addFilesController } from "../controllers/user.controller";
import { passportCall } from "../middlewares/auth.middleware";

const router = Router()

router.get('/premium/:uid', premiumUserController)
router.post('/:uid/documents', addFilesController )

export default router