import { config } from "dotenv"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


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


// export const authToken = (req, res, next) => {
//     let token = req.headers.auth
//     if (!token) token = req.signedCookies[SIGNED_COOKIE_KEY]
//     if (!token) return res.status(401).json({ error: 'Not auth' })
//     jwt.verify(token, 'secret', (error, credentials) => {
//         if (error) return res.status(403).json({ error: 'Not authorized' })
//         req.user = credentials.user
//         next()
//     })
// }

export const createHash = (password) => {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  
export const isValidPassword = (user, password) => {
    bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

//  MIDDLEWARE DEBERIA IR EN CARPETA MIDDLEWARE


export const passportCall = strategy => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(err, user, info) {
            if(err) return next(err)
            if(!user) errors.push({ text: 'The user has no authority' });
            
            req.user = user
            next()
        }) (req, res, next)
    }
}


export const handlePolicies = policies => (req, res, next) => {
    const user = req.user.user || null 
    if(policies.includes('admin')) {
        if(!user.role === 'admin') {
            return res.status(403).render('errors/base', {
                error: 'Need to be an ADMIN'
            })
        }
    }
    return next
}