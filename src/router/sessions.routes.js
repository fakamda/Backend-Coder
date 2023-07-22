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





export default router

// // Ruta para el registro de usuarios
// router.post("/register", async (req, res) => {
//   const { first_name, last_name, email, age, password } = req.body;

//   try {
//     // Verificar si el usuario ya existe en la base de datos
//     const existingUser = await UserModel.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ error: "El usuario ya existe" });
//     }

//     // Crear un nuevo usuario
//     const newUser = new UserModel({
//       first_name,
//       last_name,
//       email,
//       age,
//       password,
//       role: "usuario",
//     });
//     await newUser.save();

//     res.status(201).json({ message: "Usuario registrado con éxito" });
//   } catch (error) {
//     res.status(500).json({ error: "Error al registrar el usuario" });
//   }
// });

// // Ruta para el login de usuarios
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Verificar las credenciales del usuario en la base de datos
//     const user = await UserModel.findOne({ email, password });
//     if (!user) {
//       return res.status(401).json({ error: "Credenciales inválidas" });
//     }

//     req.session.userId = user._id;
//     req.session.userRole = user.role;

//     res.status(200).json({ message: "Login exitoso" });
//   } catch (error) {
//     res.status(500).json({ error: "Error en el login" });
//   }
// });

// export default router;
