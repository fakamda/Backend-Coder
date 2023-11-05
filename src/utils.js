import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY, SIGNED_COOKIE_KEY } from './config/config.js'
import { ProductService } from './services/index.js'


export const createHash = (password) => {
    bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }
  
export const isValidPassword = (user, password) => {
    bcrypt.compareSync(password, user.password)
}

export const generateToken = user => {
    const token = jwt.sign({ user }, JWT_PRIVATE_KEY, { expiresIn: '24h' })
    console.log(user)
    return token
}

export const extractCookie = req => {
    return (req && req.signedCookies) ? req.signedCookies[SIGNED_COOKIE_KEY] : null
}

//GENERAR EL TICKET

export const generateTicketCode = () => {
  
    const randomPart = Math.floor(Math.random() * 9000) + 1000
    const timestampPart = new Date().getTime().toString()
    const ticketCode = randomPart + timestampPart

    return ticketCode;
  }

  // CALCULAR EL TOTAL EN EL CARRITO
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

// CALCULAR EL TOTAL EN EL TICKET
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


  export const generateRandomString = (num) => {
    return [...Array(num)].map(() => {
        const randomNum = ~~(Math.random() * 36);
        return randomNum.toString(36);
    })
        .join('')
        .toUpperCase();
}
