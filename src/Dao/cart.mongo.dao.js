import cartModel from "../models/cart.model.js"

export default class CartDAO {
    getAll = async () => await cartModel.find()
    getById = async (id) => {
        const cart = await cartModel.findById(id).populate('products.product');
        return cart;
    }
    create = async (data) => await cartModel.create(data)
    update = async (id, data) => await cartModel.findByIdAndUpdate(id, data, { returnDocument: "after" });
    delete = async (id) => await cartModel.findByIdAndDelete(id)
    removeProductFromCart = async (cartId, productId) => {
        try {
          const cart = await cartModel.findById(cartId);
          if (!cart) {
            throw new Error("El carrito no existe");
          }
    
          cart.products = cart.products.filter(
            (item) => item.product.toString() !== productId
          )
    
          const updatedCart = await cart.save()
    
          return updatedCart;
        } catch (error) {
          throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
      }
}