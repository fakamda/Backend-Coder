import productModel from "../models/product.model.js";

export default class ProductDAO {
    getAll = async () => await productModel.find()
    getById = async (id) => await productModel.findById(id)
    create = async (data) => await productModel.create(data)
    update = async (id, data) => await productModel.findByIdAndUpdate(id, data, { returnDocument: "after", new: true })
    delete = async (id) => await productModel.findByIdAndDelete(id)
    getFilter = async (filter, options) => await productModel.paginate(filter, options)
}