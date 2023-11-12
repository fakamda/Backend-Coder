import UserPasswordModel from "../models/password.model"


export default class UserDAO {
    getAll = async () => await UserPasswordModel.find()
    getOne = async () => await UserPasswordModel.findOne()
    find = async () => await UserPasswordModel.find()
    getById = async (id) => await UserPasswordModel.findById(id)
    create = async (data) => await UserPasswordModel.create(data)
    update = async (id, data) => await UserPasswordModel.findByIdAndUpdate(id, data, { returnDocument: "after", new: true })
    delete = async (id) => await UserPasswordModel.findByIdAndDelete(id)
}