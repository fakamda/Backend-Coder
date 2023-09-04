import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from './config/config.js'


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


//   export const calculateTotalAmount = (products) => {
//     let totalAmount = 0;
  
//     for (const product of products) {
//       // El costo de cada producto se calcula multiplicando su precio por la cantidad comprada.
//       const productCost = product.price * product.quantity;
//       totalAmount += productCost;
//     }
  
//     return totalAmount;
//   }