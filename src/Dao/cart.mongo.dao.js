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
}