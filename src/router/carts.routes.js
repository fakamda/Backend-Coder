import { Router } from "express"
// import cartModel from "../models/cart.model.js"
// import productModel from "../models/product.model.js"
import CartManager from '../Dao/MongoManager/CartManagerDB.js'


const cartManager = new CartManager();

const router = Router()

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
    res.send(cart);
  } catch (error) {
    console.log(error);
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
  
  // router.post("/:cid/product/:pid", async (req, res) => {
  //   try {
  //     const pid = req.params.pid;
  //     const product = await productModel.findById(pid)
  //     if (!product) {
  //       return res.status(404).json({ status: "error", error: error.message })
  //     }
  //     const cid = req.params.cid;
  //     const cart = await cartModel.findById(cid)
  //     if (!cart) {
  //       return res.status(404).json({ status: "error", error: error.message })
  //     }
  //     const existingProductIndex = cart.products.findIndex(
  //       (item) => item.product.toString() === pid
  //     )
  //     if (existingProductIndex !== -1) {
  //       cart.products[existingProductIndex].quantity += 1
  //     } else {
  //       const newProduct = {
  //         product: pid,
  //         quantity: 1,
  //       }
  //       cart.products.push(newProduct);
  //     }
  //     const result = await cart.save();
  //     res.json({ status: "success", payload: result })
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).json({ status: "error", error: error.message })
  //   }
  // })
  
  // router.get("/:cid", async (req, res) => {
  //   try {
  //     const cartId = req.params.cid
  //     const cart = await cartModel.findById(cartId)
  //     if (!cart) {
  //       return res
  //         .status(404)
  //         .json({ status: "error", error: error.message })
  //     }
  //     res.send(cart)
  //   } catch (error) {
  //     console.log(error)
  //     return res.status(500).json({ error: error.message })
  //   }
  // })

// router.delete("/:cid/products/:pid", async (req, res) => {
//   try {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const cart = await cartModel.findById(cid);
//     if (!cart) {
//       return res.status(404).json({ status: "error", error: "Cart not found" });
//     }
//     cart.products = cart.products.filter(
//       (item) => item.product.toString() !== pid
//     );
//     const result = await cart.save();
//     res.json({ status: "success", payload: result });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: "error", error: error.message });
//   }
// });

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
});

// router.put("/:cid", async (req, res) => {
//   try {
//     const cid = req.params.cid;
//     const updatedProducts = req.body.products;
//     const cart = await cartModel.findById(cid);
//     if (!cart) {
//       return res.status(404).json({ status: "error", error: "Cart not found" });
//     }
//     cart.products = updatedProducts;
//     const result = await cart.save();
//     res.json({ status: "success", payload: result });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: "error", error: error.message });
//   }
// })

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
});

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