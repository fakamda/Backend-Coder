import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"


export const getCartsController = async (req, res) => {
  try {
    const carts = await cartModel.find().lean().exec() //GETALL
    res.status(200).json({ status: "success", payload: carts })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message })
  }
};

export const getCartByIdController = async (req, res) => {
  try {
    const cartId = req.params.cid
      const cart = await cartModel.findById(cartId) //GETBYID
      if (!cart) {
        throw new Error("Cart not found")
      }
      res.status(200).json({ status: "success", payload: cart })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const createCartController = async (req, res) => {
  try {
    const cart = req.body;
    const addCart = await cartModel.create(cart) //CREATE
    res.json({ status: "success", payload: addCart })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message })
  }
}

export const addProductToCartController = async (req, res) => {
  try {
    const pid = req.params.pid
    const cid = req.user.cart
    
    const product = await productModel.findById(pid) // Use the productModel method
    if (!product) {
      throw new Error("Product not found");
    }

    const cart = await cartModel.findById(cid) //find by id
    if (!cart) {
      throw new Error("Cart not found")
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      const newProduct = {
        product: pid,
        quantity: 1,
      };
      cart.products.push(newProduct);
    }

    const result = await cart.save()
    
    res.json({ status: "success", payload: result });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error.message });
  }
}

export const removeProductFromCartController = async (req, res) => {
  try {
    const cid = req.user.cart
    const pid = req.params.pid
    
    const cart = await cartModel.findById(cid); // find by id
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    )

    const result = await cart.save();
    
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
}


export const updateCartController = async (req, res) => {
  try {
    const cid = req.user.cart
    const updatedProducts = req.body.products;

    const cart = await cartModel.findById(cid); // find by id
    if (!cart) {
      throw new Error("Cart not found");
    }

    cart.products = updatedProducts;
    const result = await cart.save();

    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
}

export const updateProductFromCartController = async (req, res) => {
  try {
    const cid = req.user.cart
    const pid = req.params.pid;

    const cart = await cartModel.findById(cid); //find by id
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    const updatedProduct = req.body.product;

    const product = await productModel.findById(pid); // PRODUCT FIND BY ID
    if (!product) {
      return res.status(404).json({ status: "error", error: "Product not found" });
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (existingProductIndex !== -1) {
      cart.products[existingProductIndex].quantity = updatedProduct.quantity;
    } else {
      return res
        .status(404)
        .json({ status: "error", error: "Product not found in cart" });
    }

    const result = await cart.save();
    res.json({ status: "success", payload: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

