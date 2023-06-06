import express from 'express'
import ProductRouter from './router/product.routes.js'
import CartRouter from './router/carts.routes.js'


const app = express()
const PORT = 8080 

app.use(express.urlencoded({ extended : true }))
app.use(express.json())

app.use("/products", ProductRouter)
app.use("/cart", CartRouter)

const server = app.listen(PORT, () => {
    console.log(`Server Up... in port ${server.address().port}`)
}) 

server.on("error", (err) => {
    console.log(`Error in the server ${err}`)
})

