import { io } from './app.js'
import messageModel from './models/chat.model.js'

export const socketServerConnection = () => {
    io.on("connection", async socket => {
        socket.on("productList", data => {
        io.emit("updatedProducts", data)
      })
    
      let messages = await messageModel.find()
    
      socket.broadcast.emit("alert");
      socket.emit("logs", messages);
      socket.on("message", async (data) => {
        messages.push(data);
        await messageModel.create(data)
        io.emit("logs", messages)
      })
      
    })
}



