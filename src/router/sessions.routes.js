import { Router } from "express";
import passport from "passport";
import { passportCall } from "../middlewares/auth.middleware.js";
import { currentViewController, forgetPasswordController, forgetPasswordviewController, githubLoginController, githubPassportController, loginViewController, premiumUserController, registerViewController, resetPasswordController, resetPasswordviewController, userLoginController, userLogoutController, verifyTokenController } from "../controllers/sessions.controller.js";

const router = Router()

router.post('/register', passport.authenticate('register', { successRedirect: '/session/login', failureRedirect: '/session/register', failureFlash: true }))
router.post('/login', passport.authenticate('login', { failureRedirect: '/session/login'}), userLoginController)
router.get('/logout', userLogoutController)
router.get('/github', passport.authenticate('github', { scope: ['user:email']}), githubPassportController)
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/session/login'}), githubLoginController)
router.post('/forget-password', forgetPasswordController)
router.get('/verify-token/:token', verifyTokenController)
router.post('/reset-password/:user', resetPasswordController)
router.get('/premium/:uid', premiumUserController)

router.get('/register', registerViewController)
router.get('/login', loginViewController)
router.get('/current', passportCall("jwt"), currentViewController)
router.get('/forget-password', forgetPasswordviewController)
router.get('/reset-password/:token', resetPasswordviewController)

export default router