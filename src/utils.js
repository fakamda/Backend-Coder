import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from './config/config.js'
import { ProductService } from './services/index.js'


export const createHash = (password) => {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  
export const isValidPassword = (user, password) => {
    bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    return token
}

export const extractCookie = req => {
    return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null
}

//  MIDDLEWARE DEBERIA IR EN CARPETA MIDDLEWARE

export const generateTicketCode = () => {
    // Generate a random number between 1000 and 9999
    const randomPart = Math.floor(Math.random() * 9000) + 1000;
  
    // Get the current timestamp and convert it to a string
    const timestampPart = new Date().getTime().toString();
  
    // Combine the random part and timestamp part to create a unique code
    const ticketCode = randomPart + timestampPart;
  
    return ticketCode;
  }

  export const calculateTotalAmount = (cart) => {
    let totalAmount = 0;
  
    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;
  
      if (product && product.price) {
        totalAmount += product.price * quantity;
      }
    }
  
    return totalAmount;
  };


  export const calculateTicketAmount = async (cart) => {
    let totalAmount = 0;
  
    for (const cartProduct of cart.products) {
      const productId = cartProduct.product;
      const desiredQuantity = cartProduct.quantity;
  
      const product = await ProductService.getById(productId)
  
      if (!product) {
        throw new Error("Product not found");
      }
  
      if (product.stock >= desiredQuantity) {
        totalAmount += product.price * desiredQuantity;
      }
    }
  
    return totalAmount;
  };