import { io } from './app.js';
import messageModel from './models/chat.model.js';

export const socketServerConnection = () => {
  io.on("connection", async (socket) => {
    socket.on("productList", async (data) => {
      // Assuming data has a 'thumbnails' attribute
      const productsWithFullPath = data.map(product => {
        return {
          ...product,
          fullImagePath: `/img/products/${product.thumbnails}`
        };
      });

      io.emit("updatedProducts", productsWithFullPath);
    });

    let messages = await messageModel.find();

    socket.broadcast.emit("alert");
    socket.emit("logs", messages);

    socket.on("message", async (data) => {
      messages.push(data);
      await messageModel.create(data);
      io.emit("logs", messages);
    });
  });
};
