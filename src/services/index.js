import  ProductDAO  from '../Dao/product.mongo.dao.js'
// import { Product } from '../Dao/product.factory.js'
import ProductRepository from '../repositories/product.repository.js'


export const ProductService = new ProductRepository(new ProductDAO())

