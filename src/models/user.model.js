import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, unique: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
  age: { type: Number },
  password: { type: String, required: true },
  role: { type: String , default: 'user' },
  documents: { type: [{ name: { type: String }, reference: { type: String }}], default: [] },
  status: { type: Boolean, default: false },
  profilePicture: { type: String },
  last_connection: { type: Date },
});

userSchema.methods.encryptPassword = async password => {
  const salt = bcrypt.genSaltSync(10)
  return bcrypt.hashSync(password, salt)
}

 userSchema.methods.isValidPassword = async function(password){
  return bcrypt.compareSync(password, this.password)
}

mongoose.set("strictQuery", false);

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel
