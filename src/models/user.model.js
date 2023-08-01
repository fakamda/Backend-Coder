import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, unique: true },
  age: { type: Number },
  password: { type: String, required: true },
  role: String 
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
