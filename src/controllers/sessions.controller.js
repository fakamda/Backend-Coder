import { JWT_COOKIE_NAME, NODEMAILER_PASS, NODEMAILER_USER, PORT } from "../config/config.js";
import UserDTO from "../dto/user.dto.js";
import UserModel from '../models/user.model.js'
import { generateRandomString } from "../utils.js";
import UserPasswordModel from '../models/password.model.js'
import nodemailer from 'nodemailer'

export const userLoginController = async (req, res) => {
  if (!req.user) {
    res.status(400).send({ status: "error", error: "invalid credentials" })
  }
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products')
}

export const userLogoutController = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME).redirect('/')
}

export const githubPassportController = async(req, res) => {}

export const githubLoginController = async(req, res) => {
        console.log('Callback: ', req.user)
        req.session.user = req.user
        console.log('User session: ', req.session.user)
        res.redirect('/')
    }

// render de register form
export const registerViewController = (req, res) => {
  res.render("sessions/register");
}

// Render the login form
export const loginViewController = (req, res) => {
  res.render("sessions/login");
}
// render de current
export const currentViewController = (req, res) => {
  const user = new UserDTO(req.user.user)
  res.render("sessions/current", { user })
}
// funciona ok
export const forgetPasswordController = async (req, res) => {
  const email = req.body.email
  const user = await UserModel.findOne({ email })
  if(!user) {
    return res.status(400).json({ status: 'error', error: 'user not found' })
  }
  const token = generateRandomString(16)
  await UserPasswordModel.create({ email, token })

  const mailerConfig = { 
    service: 'gmail',
    auth: { user: NODEMAILER_USER, pass: NODEMAILER_PASS }
   }
   let transporter = nodemailer.createTransport(mailerConfig)
   let message = {
    from: NODEMAILER_USER,
    to: email,
    subject: '[Ecommerce API] Reset Your password',
    html: `<h1>[Ecommerce API] Reset Your password </h1> <hr /> You asked to reset your password. You can do it here: 
    <a href="http://${req.hostname}:${PORT}/reset-password/${token}">http://${req.hostname}:${PORT}/reset-password/${token}</a> `
   }
   try {
    await transporter.sendMail(message)
    res.json({ stauts: 'success', message: `Your email has successfully sent to ${email} in order to reset password` })
   } catch (err) {
    res.status(500).json({ status: 'error', error: err.message })
   }
}