import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import viewsRouter from './router/views.routes.js'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'
import ProductManager from './controllers/productManager.js'


const app = express()
const PORT = 8080

const productManager = new ProductManager()
const httpServer = app.listen(PORT, () => console.log(`Server Up... in port ${httpServer.address().port}`)) 

httpServer.on("error", (err) => console.log(`Error in the server ${err}`))

const io = new Server(httpServer)


app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.static('./src/public'))
app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.use((req, res, next) => {
    req.io = io
    next()
})

app.use("/api/products", ProductRouter)
app.use("/api/cart", CartRouter)
app.use('/products', viewsRouter)


app.get('/', (req, res) => res.render('index'))
 

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado')
    socket.on('productList', async data => {
        let products = await productManager.addProduct(data)
        io.emit('updatedProducts', products)
    }) 
})