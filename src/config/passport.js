import passport  from 'passport'
import local from 'passport-local'

import UserModel, {} from '../models/user.model.js'


const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    } , async (email, password, done) => {

        // confirmar si existe el correo en la base de datos.
        const user = await UserModel.findOne({ email })
        if (!user) {
            return done(null, false, { message: 'User not found' })
        } else {
            //confirmar si la contraseña coincide
         const match = await user.isValidPassword(password)
         if (match) {
            return done(null, user)
         }else {
            return done(null, false, { message: 'Incorrect Password' })
        }
    }
    }))

} 

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport