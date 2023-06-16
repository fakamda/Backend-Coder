import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'



const app = express()
app.use(express.json())

const PORT = 8080

const serverHttp = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`)
);
const io = new Server(serverHttp)

app.set("socketio", io)

app.use(express.static('./src/public'))
app.engine("handlebars", handlebars.engine());
app.set('views', './src/views')
app.set("view engine", "handlebars")

app.get("/", (req, res) => res.render("index", {name:"Facundo"}))

app.use("/api/products", ProductRouter)
app.use("/api/carts", CartRouter)
app.use("/products", viewsRouter)

io.on("connection", socket => {
  console.log("Successful Connection")
  socket.on("productList", data => {
    io.emit("updatedProducts", data)
  })
})