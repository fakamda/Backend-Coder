// // authRouter.js
import express from "express";
import UserModel from "../models/user.model.js"; // Asegúrate de tener la ruta correcta al UserModel

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

router.post('/login', async (req, res) => {
  res.send('login')
})

router.get('/logout', async (req, res) => {
  res.send('logout')
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