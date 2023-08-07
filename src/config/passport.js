import passport  from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { CLIENT_SECRET, CLIENT_ID } from '../utils.js'
import { JWT_PRIVATE_KEY, createHash, extractCookie, generateToken, isValidPassword } from '../utils.js'
import passport_jwt from 'passport-jwt'

import UserModel, {} from '../models/user.model.js'

const JWTStrategy = passport_jwt.Strategy
const ExtractJWT = passport_jwt.ExtractJwt


const localStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // This allows us to pass the request object to the callback
    }, async (req, email, password, done) => {
    
        const { first_name, last_name, age } = req.body;
    
        const errors = [];
    
        if (password.length < 4) {
            errors.push({ text: 'Password must be at least 4 characters' });
        }
    
        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            errors.push({ text: 'The user already exists.' });
        }
    
        if (errors.length > 0) {
            return done(null, false, { errors });
        } else {
    
            // Create a new user
            const newUser = new UserModel({
                first_name,
                last_name,
                email,
                age,
                password,
                role: "user",
            });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            return done(null, newUser);
        }
    }))


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

    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) => {
        // console.log(profile)
        try {
            const user = await UserModel.findOne({ email: profile._json.email })
            if (user) return done(null, user)
            const newUser = await UserModel.create({
                first_name: profile._json.name,
                email: profile._json.email,
                password,
                role: "user"
            })
            newUser.password = await newUser.encryptPassword(password);
            return done(null, newUser)
        } catch(err) {
            return done(`Error to login with GitHub => ${err.message}`)
        }
    }))


    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
        secretOrKey: JWT_PRIVATE_KEY
    }, async(jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id)
        done(null, user)
    })


} 

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await UserModel.findById(id)
    done(null, user)
})

export default initializePassport