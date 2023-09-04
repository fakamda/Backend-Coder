import UserModel from "../models/user.model.js"


export default class UserDAO {
    getAll = async () => await UserModel.find()
    getOne = async () => await UserModel.findOne()
    getById = async (id) => await UserModel.findById(id)
    create = async (data) => await UserModel.create(data)
    update = async (id, data) => await UserModel.findByIdAndUpdate(id, data, { returnDocument: "after", new: true })
    delete = async (id) => await UserModel.findByIdAndDelete(id)
}