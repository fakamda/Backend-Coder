import mongoose from "mongoose"

const ticketSchema = new mongoose.Schema ({
        code: { type: String, required: true, unique: true },
        purchase_datetime: { type: Date, default: Date.now, required: true },
        amount: { type: Number, required: true },
        purchaser: { type: String, required: true },
        products: {}
})


mongoose.set("strictQuery", false);

const ticketModel = mongoose.model("ticket", ticketSchema)

 export default ticketModel