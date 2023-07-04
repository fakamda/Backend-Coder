import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'
import messageModel from './models/chat.model.js'
import mongoose from 'mongoose'

const MONGO_URI = 'mongodb+srv://coder:coder@cluster0.b5lk3ud.mongodb.net/'
// const MONGO_URI = 'mongodb://localhost:27017/'
const MONGO_DB_NAME = 'ecommerce'

const app = express()
app.use(express.json())

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


