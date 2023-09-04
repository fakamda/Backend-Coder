import { PERSISTENCE } from '../config/config.js'

export let Product

switch (config.persistence) {
    case 'MONGO': 
        const { default: ProductDAO } = await import('../Dao/product.mongo.dao.js')
        Product = ProductDAO
        break
    case 'FILE':
        const { default: ProductFileDAO } = await import('../Dao/product.file.dao.js')
        Product = ProductFileDAO
        break
        
    default:
        break
}