import { config } from "dotenv"

config()

export const MONGO_URI = process.env.MONGO_URI 
export const MONGO_DB_NAME = process.env.MONGO_DB_NAME
export const CLIENT_ID = process.env.CLIENT_ID
export const CLIENT_SECRET = process.env.CLIENT_SECRET
// export const COOKIE_SECRET_PASS = process.env.COOKIE_SECRET_PASS
export const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY
export const SIGNED_COOKIE_KEY = process.env.SIGNED_COOKIE_KEY
export const PORT = process.env.PORT
export const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
export const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME
export const PERSISTENCE = process.env.PERSISTENCE
export const NODEMAILER_USER = process.env.NODEMAILER_USER
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS
