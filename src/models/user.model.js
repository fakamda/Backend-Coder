import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  role: String 
});

userSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

mongoose.set("strictQuery", false);

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel
