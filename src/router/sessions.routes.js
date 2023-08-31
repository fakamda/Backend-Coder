import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/auth.middleware.js";
import { currentViewController, githubLoginController, githubPassportController, loginViewController, registerViewController, userLoginController, userLogoutController } from "../controllers/sessions.controller.js";

const router = Router()

router.post('/register', passport.authenticate('register', { successRedirect: '/session/login', failureRedirect: '/session/register', failureFlash: true }))
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/login'}), userLoginController)
router.get('/logout', userLogoutController)
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubPassportController)
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/session/login'}), githubLoginController)
router.get('/register', registerViewController)
router.get('/login', loginViewController)
router.get('/current', passportCall("jwt"), currentViewController)

export default router