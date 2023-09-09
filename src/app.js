import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'
import mongoose from 'mongoose'
import passport from 'passport'
import initializePassport from './config/passport.js'
import { PORT, SESSION_SECRET_KEY } from './config/config.js'
import session from "express-session";
import cookieParser from "cookie-parser";
import sessionsRouter from './router/sessions.routes.js'
import MongoConnection from './database.js'
import { socketServerConnection } from './socketServer.js'
import { passportCall } from './middlewares/auth.middleware.js'
import MockRouter from './router/mock.routes.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


app.use(
  session({
    secret: SESSION_SECRET_KEY, // Cambia esto por una cadena secreta para firmar las cookies
    resave: false,
    saveUninitialized: true,
  })
)

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


const serverHttp = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`)
)
export const io = new Server(serverHttp)

app.set("socketio", io)

app.use(express.static('./src/public'))
app.engine("handlebars", handlebars.engine());
app.set('views', './src/views')
app.set("view engine", "handlebars")

mongoose.set('strictQuery', false)

try {
  await MongoConnection.getInstance()

   app.get("/", (req, res) => {
    const user = req.user
    res.render("index", { name:"Facundo", user })
   })

    app.use("/api/products", ProductRouter);
    app.use("/api/carts", passportCall("jwt"), CartRouter);
    app.use("/products", passportCall("jwt"), viewsRouter);
    app.use("/session", sessionsRouter)
    app.use("/api/mock", MockRouter)

    socketServerConnection()

} catch(err) {
    console.log(err.message)
}


