import express from "express";
// import UserModel from "../models/user.model.js" 
import passport from "passport";
import { JWT_COOKIE_NAME } from "../utils.js";

const router = express.Router()

router.post('/register', passport.authenticate('register', {
  successRedirect: '/session/login',   // La URL a la que redireccionar si el registro es exitoso
  failureRedirect: '/session/register',    // La URL a la que redireccionar si hay errores en el registro
  failureFlash: true               // Habilitar mensajes flash para mostrar los errores (si los hay)
}))

router.post('/login', passport.authenticate('login', { failureRedirect: '/session/login'}), async (req, res) => {
  // const { email } = req.body;
  // const user = await UserModel.findOne({ email: email });
  // req.session.user = user
  // res.redirect('/products')
  if (!req.user) {
    res.status(400).send({ status: "error", error: "invalid credentials" })
  }
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
})

router.get('/logout', (req, res) => {
  // req.session.destroy(err => {
  //     if(err) {
  //         console.log(err);
  //         res.status(500).render('errors/base', {error: err})
  //     } else res.redirect('/session/login')
  // })
  res.clearCookie(JWT_COOKIE_NAME).redirect('/')
})

router.get('/github',
    passport.authenticate('github', { scope: ['user:email']}),
    async(req, res) => {}
)

router.get('/githubcallback', 
    passport.authenticate('github', {failureRedirect: '/session/login'}),
    async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log('User session: ', req.session.user)
        res.redirect('/')
    }
)

// render de register form
router.get("/register", (req, res) => {
  res.render("sessions/register");
})

// Render the login form
router.get("/login", (req, res) => {
  res.render("sessions/login");
})


export default router;