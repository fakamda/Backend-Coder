import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from './config/config.js'


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