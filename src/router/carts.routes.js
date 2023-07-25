import { Router } from "express"
import CartManager from '../Dao/MongoManager/CartManagerDB.js'


const cartManager = new CartManager();

const router = Router()

// export const getProductsFromCart = async (req, res) => {
//   try{
//     const id = req.params.cid
//     const result = await cartModel.findById(id).populate('products.product').lean()
//     if (result === null) {
//       return {
//         statusCode: 404,
//         response: { status: 'error', error: 'Not Found' }
//       }
//     }
//     return {
//       statusCode: 200,
//       response: { status: 'success', payload: result }
//     }
//   } catch(err) {
//     return {
//       statusCode: 500,
//       response: { status: 'success', error: err.message  }
//     }
//   }
//   }
  

router.get("/", async (req, res) => {
  try {
    const carts = await cartManager.getCarts()
    res.status(200).json({status: "success", payload: carts});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
})


router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.send(cart)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message });
  }
})

router.post("/", async (req, res) => {
  try {
    const cart = req.body
    const addCart = await cartManager.createCart(cart)
    res.json({ status: "success", payload: addCart })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message })
  }
})

  router.post("/:cid/product/:pid", async (req, res) => {
    try {
      const pid = req.params.pid
      const cid = req.params.cid
      const result = await cartManager.addProductToCart(cid, pid)
      res.json({ status: "success", payload: result })
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: "error", error: error.message });
    }
  })


router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.removeProductFromCart(cid, pid);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
})

router.put("/:cid", async (req, res) => {
  try {
    const cid = req.params.cid
    const updatedProducts = req.body.products;
    const result = await cartManager.updateCart(cid, updatedProducts)
    res.json({ status: "success", payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message })
  }
})

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const cart = await cartManager.getCartById(cid)
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" })
    }

    const updatedProducts = req.body.products;

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );
    
    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = updatedProducts.quantity;
    } else {
      return res.status(404).json({ status: "error", error: "Product not found in cart" })
    }

    const result = await cartManager.updateCart(cid, cart.products)
    res.json({ status: "success", payload: result })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message })
  }
})
  
  
  export default router