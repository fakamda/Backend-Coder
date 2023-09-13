import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"
import ticketModel from '../models/ticket.model.js'
import { CartService, ProductService } from '../services/index.js'
import { generateTicketCode, calculateTicketAmount } from "../utils.js"
// import UserDTO from "../dto/user.dto.js"


export const getCartsController = async (req, res) => {
  try {
    // const carts = await cartModel.find().lean().exec() //GETALL
    const carts = await CartService.getAll()
    res.status(200).json({ status: "success", payload: carts })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ status: "error", error: error.message })
  }
};

export const getCartByIdController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    
    // Obtener el carrito por su ID
    const cart = await CartService.getById(cartId)
    // Realiza la población en el controlador

    if (!cart) {
      throw new Error("Cart not found");
    }

    // Calcular el monto total del carrito
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      const quantity = item.quantity;

      if (product && product.price) {
        totalAmount += product.price * quantity;
      }
    }

    res.status(200).json({ status: "success", payload: { cart, totalAmount } });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
};

export const createCartController = async (req, res) => {
  try {
    const cart = req.body;
    // const addCart = await cartModel.create(cart) //CREATE
    const addCart = await CartService.create(cart)
    res.json({ status: "success", payload: addCart })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message })
  }
}

export const addProductToCartController = async (req, res) => {
  try {
    const pid = req.params.pid
    // const cid = req.user.cart
    const cid = req.params.cid
    
    // const product = await productModel.findById(pid) // Use the productModel method
    const product = await ProductService.getById(pid)
    if (!product) {
      throw new Error("Product not found");
    }

    // const cart = await cartModel.findById(cid) //find by id
    const cart = await CartService.getById(cid)
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
    // const cid = req.user.cart
    const cid = req.params.cid
    const pid = req.params.pid
    
    // const cart = await cartModel.findById(cid); // find by id
    const cart = await CartService.getById(cid)
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
    // const cid = req.user.cart
    const cid = req.params.cid
    const updatedProducts = req.body.products;

    // const cart = await cartModel.findById(cid); // find by id
    const cart = await CartService.getById(cid)
    if (!cart) {
      throw new Error("Cart not found")
    }

    cart.products = updatedProducts;
    const result = await cart.save();

    res.json({ status: "success", payload: result })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
}

export const updateProductFromCartController = async (req, res) => {
  try {
    // const cid = req.user.cart
    const cid = req.params.cid
    const pid = req.params.pid;

    // const cart = await cartModel.findById(cid); //find by id
    const cart = await CartService.getById(cid)
    if (!cart) {
      return res.status(404).json({ status: "error", error: "Cart not found" });
    }

    const updatedProduct = req.body.product;

    // const product = await productModel.findById(pid); // PRODUCT FIND BY ID
    const product = await ProductService.getById(pid)
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
}

export const purchaseCartController = async (req, res) => {
  try {
    const cartId = req.params.cid;
    let cart = await cartModel.findById(cartId);
    const user = req.user.user

    console.log(user)
    if (!cart) {
      throw new Error("Cart not found");
    }

    const ticketProducts = [];
    const failedToPurchase = [];

    const totalAmount = await calculateTicketAmount(cart)

    for (const cartProduct of cart.products) {
      const productId = cartProduct.product;
      const desiredQuantity = cartProduct.quantity;

      const product = await productModel.findById(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock >= desiredQuantity) {
        product.stock -= desiredQuantity;
        await product.save();

        ticketProducts.push({
          productId: product._id,
          quantity: desiredQuantity,
        });

        // Eliminar el producto del carrito después de comprarlo... para esto updateamos el carrito el $pull es un operador de bases no sql
        const updatedCart = await cartModel.findByIdAndUpdate(
          cartId,
          {
            $pull: { products: { product: productId } },
          },
          { new: true }
        );
        cart = updatedCart // Actualizar la referencia al carrito actualizado// se declara como let el carrito por que sino no se puede mutar.
      } else {
        failedToPurchase.push(product._id);
      }
    }
    

    if (ticketProducts.length > 0) {

      const ticket = new ticketModel({
        code: generateTicketCode(),
        purchase_datetime: new Date(),
        amount: totalAmount, 
        purchaser: `${req.user.user.first_name} ${req.user.user.last_name}` || null, 
        products: ticketProducts, 
      })

      await ticket.save();

      res.status(200).json({ status: "success", payload: ticket });
    } else {
      res.status(400).json({status: "error", message: "No products could be purchased", failedProducts: failedToPurchase});
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", error: error.message });
  }
}

export const getUserCartController = (req, res) => {
  const userCart = req.user.user.cart 


  res.json({ userCart });
}