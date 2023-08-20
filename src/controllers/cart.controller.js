import CartManager from "../Dao/MongoManager/CartManagerDB.js";
import cartModel from "../models/cart.model.js";


const cartManager = new CartManager();

export const getCartsController = async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.status(200).json({ status: "success", payload: carts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const getCartByIdController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.send(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const createCartController = async (req, res) => {
  try {
    const cart = req.body;
    const addCart = await cartManager.createCart(cart);
    res.json({ status: "success", payload: addCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const addProductToCartController = async (req, res) => {
    
  try {
    const pid = req.params.pid;
    const cid = req.user.cart
    console.log(cid)
    const result = await cartManager.addProductToCart(cid, pid);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

// export const addProductToCartController = async (req, res) => {
//     const cartID = req.params.cid
//     const productID = req.params.pid
//     const quantity= req.body.quantity || 1
//     const cart = await cartModel.findById(cartID)
  
//     let found = false
//     for (let i = 0; i < cart.products.length; i++) {
//         if (cart.products[i].id == productID) {
//             cart.products[i].quantity++
//             found = true
//             break
//         }
//     }
//     if (found == false) {
//         cart.products.push({ id: productID, quantity})
//     }
  
//     await cart.save()
  
  
//     res.json({status: "Success", cart})
//   }

export const removeProductFromCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await cartManager.removeProductFromCart(cid, pid);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const updateCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const updatedProducts = req.body.products;
    const result = await cartManager.updateCart(cid, updatedProducts);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const updateProductFromCartController = async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    const updatedProducts = req.body.products;

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = updatedProducts.quantity;
    } else {
      return res
        .status(404)
        .json({ status: "error", error: "Product not found in cart" });
    }

    const result = await cartManager.updateCart(cid, cart.products);
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};
