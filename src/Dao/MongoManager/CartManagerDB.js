import cartModel from "../../models/cart.model.js";
import ProductManager from "./ProductManagerDB.js";

class CartManager {

  async createCart(cartData) {
    try {
      const addCart = await cartModel.create(cartData);
      return addCart;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async addProductToCart(cartId, productId) {
    try {
    const product = await ProductManager.getProductById(productId);
        if (!product) {
        throw new Error("Product not found");
        }

      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        const newProduct = {
          product: productId,
          quantity: 1,
        };
        cart.products.push(newProduct);
      }

      const result = await cart.save();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async getCarts() {
    try {
      const cart = await cartModel.find().lean().exec()
      return cart
    } catch (error) {
      console.log(error)
      throw new Error(error.message)
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      const result = await cart.save();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.products = updatedProducts;
      const result = await cart.save();
      return result;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  
}

export default CartManager