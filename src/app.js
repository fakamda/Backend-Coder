import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'
import messageModel from './models/chat.model.js'
import mongoose from 'mongoose'
import passport from 'passport'
import initializePassport from './config/passport.js'

import session from "express-session";
// import cookieParser from "cookie-parser";
import sessionsRouter from './router/sessions.routes.js'

const MONGO_URI = 'mongodb+srv://coder:coder@cluster0.b5lk3ud.mongodb.net/'
// const MONGO_URI = 'mongodb://localhost:27017/'
const MONGO_DB_NAME = 'ecommerce'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(cookieParser());
app.use(
  session({
    secret: "Secret", // Cambia esto por una cadena secreta para firmar las cookies
    resave: false,
    saveUninitialized: true,
  })
)
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

const PORT = 8080

const serverHttp = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`)
)
const io = new Server(serverHttp)

app.set("socketio", io)

app.use(express.static('./src/public'))
app.engine("handlebars", handlebars.engine());
app.set('views', './src/views')
app.set("view engine", "handlebars")

mongoose.set('strictQuery', false)

try {
   await mongoose.connect(MONGO_URI, {
    dbName: MONGO_DB_NAME,
    useUnifiedTopology: true
   })
   console.log('Db Connected')

   app.get("/", (req, res) => res.render("index", {name:"Facundo"}))

    app.use("/api/products", ProductRouter)
    app.use("/api/carts", CartRouter)
    app.use("/products", viewsRouter)

    app.use("/session", sessionsRouter)

    io.on("connection", async socket => {
    console.log("Successful Connection")
    socket.on("productList", data => {
    io.emit("updatedProducts", data)
  })

  let messages = await messageModel.find()

  socket.broadcast.emit("alert");
  socket.emit("logs", messages);
  socket.on("message", async (data) => {
    messages.push(data);
    await messageModel.create(data)
    io.emit("logs", messages)
  })
  
})

} catch(err) {
    console.log(err.message)
}


