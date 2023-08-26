// import config from '../config/config.js'

export let Product

switch (config.persistence) {
    case 'MONGO': 
        const { default: ProductDAO } = await import('../Dao/product.mongo.dao.js')
        Product = ProductDAO
        break
    default:
        break
}