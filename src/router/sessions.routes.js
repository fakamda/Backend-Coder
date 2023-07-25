import express from "express";
import UserModel from "../models/user.model.js" 
import passport from "passport";

const router = express.Router()

router.post('/register', async (req, res) => {

  const errors = []

  const {first_name, last_name, age, email, password} = req.body

  if(password.length < 4) {
    errors.push({text: 'Password must be at least 4 characters'})
  }

  const existUser = await UserModel.findOne({ email })
    if(existUser) {
     errors.push({ text: 'The user already exist.'})
    //  return res.status(409).json({ error: "El usuario ya existe" });
      // res.redirect('/register')
    }
  if (errors.length > 0) {
    res.render('sessions/register', {
      errors, 
        first_name,
        last_name,
        age,
        email
    })
  } else {

//  Crear un nuevo usuario
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      age,
      password,
      role: "usuario",
    })
      newUser.password = await newUser.encryptPassword(password)
      await newUser.save()
      res.redirect('login')
      
  }


})

router.post('/login', passport.authenticate('login', { failureRedirect: '/session/login'}), async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  req.session.user = user
  res.redirect('/products')
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if(err) {
          console.log(err);
          res.status(500).render('errors/base', {error: err})
      } else res.redirect('/session/login')
  })
})

// render de register form
router.get("/register", (req, res) => {
  res.render("sessions/register");
})

// Render the login form
router.get("/login", (req, res) => {
  res.render("sessions/login");
})


export default router;