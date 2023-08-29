import  ProductDAO  from '../Dao/product.mongo.dao.js'
import CartDAO from '../Dao/cart.mongo.dao.js'
// import { Product } from '../Dao/product.factory.js'
import ProductRepository from '../repositories/product.repository.js'
import CartRepository from '../repositories/cart.repository.js'



export const ProductService = new ProductRepository(new ProductDAO())
export const CartService = new CartRepository(new CartDAO())


