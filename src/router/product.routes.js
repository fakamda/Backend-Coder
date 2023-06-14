import { Router } from "express"
import ProductManager from '../controllers/productManager.js';

const router = Router()

const productManager = new ProductManager();


router.get('/', async(req, res) => {
    let limit = parseInt(req.query.limit)
    let products = await productManager.getProducts()
    if(!limit){ 
        return res.status(200).json({ products })
    }
    let limitAndIdExist = products.some(prod => prod.id == limit)
    if(limitAndIdExist){
        let productLimit = products.slice(0, limit)
        return res.status(200).json({ message: `productos desde el 0 hasta ${limit}`, products: productLimit})
    }
    return res.status(404).json({ message: `Error! Solo, el producto no existe!`})
})


router.get('/:pid', async(req, res) => {
    let id = parseInt(req.params.pid)
    let productById = await productManager.getProductById(id)
    if(!productById){
        return res.status(404).json({ error: `Error! No existe el id(${id}) en esta lista.` })
    }else{
        return res.status(200).json({ product: productById })
    }
})


router.post('/', async(req, res) => {
    let newProduct = req.body
    const products = await productManager.addProduct(newProduct)
    req.io.emit('updatedProducts', products)
    return res.status(200).json({ message: 'Producto Agregado'})    
})


router.put('/:pid', async(req, res) => {
    let id = parseInt(req.params.pid)
    let data = req.body
    let productUpdated = await productManager.updateProduct(id, data)
    if(!productUpdated) return res.status(404).json({ message: 'Producto No Encontrado.'})
        req.io.emit('updatedProducts', await readProducts)
        return res.status(200).json({ message: 'Producto Actualizado' })
})


router.delete('/:pid', async(req, res) => {
    let id = parseInt(req.params.pid)
    let products = await productManager.getProducts()
    let productExists = products.some(prod => prod.id == id)
    if(!productExists) return res.status(404).json({ message: `Producto a eliminar con id: ${id} no existe.`})
    let productsUpdated = await productManager.deleteProduct(id)
    req.io.emit('updatedProducts', productsUpdated)
    return res.status(200).json({ message: `el producto con id: ${id} ha sido eliminado.` })

})

export default router