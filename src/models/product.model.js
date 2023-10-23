import mongoose, { Schema, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    code: { type: String, unique: true, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], default: [] },
    owner: { type: String, required: true, default: 'admin', ref: "users" }
})

productSchema.plugin(mongoosePaginate)

mongoose.set('strictQuery', false)

const productModel = model('products', productSchema)

export default productModel