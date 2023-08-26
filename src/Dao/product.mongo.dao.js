import productModel from "../models/product.model";

export default class ProductDAO {
    getAll = async() => await productModel.find()
    getById = async() => await productModel.findById(id)
    create = async(data) => await productModel.create(data)
    update = async(id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: "after" })
    delete = async (id) => await productModel.findByIdAndDelete(id)
}