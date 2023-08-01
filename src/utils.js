import { config } from "dotenv"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


config()

export const MONGO_URI = process.env.MONGO_URI 
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
export const COOKIE_SECRET_PASS = process.env.COOKIE_SECRET_PASS
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const SIGNED_COOKIE_KEY = process.env.SIGNED_COOKIE_KEY
export const PORT = process.env.PORT



export const generateToken = user => {
    const token = jwt.sign({ user }, PRIVATE_KEY , { expiresIn: '24h' })
    return token
}

export const authToken = (req, res, next) => {
    let token = req.headers.auth
    if (!token) token = req.signedCookies[SIGNED_COOKIE_KEY]
    if (!token) return res.status(401).json({ error: 'Not auth' })
    jwt.verify(token, 'secret', (error, credentials) => {
        if (error) return res.status(403).json({ error: 'Not authorized' })
        req.user = credentials.user
        next()
    })
}



export const createHash = (password) => {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  
export const isValidPassword = (user, password) => {
    bcrypt.compareSync(password, user.password)
}