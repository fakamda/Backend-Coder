// import config from '../config/config.js'

import { PERSISTENCE } from '../../config/config.js';

export let Cart

switch (PERSISTENCE) {
    case 'MONGO': 
        const { default: CartDAO } = await import('../Dao/cart.mongo.dao.js');
        Cart = CartDAO;
        break;
    case 'FILE':
        const { default: CartFileDAO } = await import('../Dao/cart.file.dao.js');
        Cart = CartFileDAO;
        break;
    default:
        break;
}