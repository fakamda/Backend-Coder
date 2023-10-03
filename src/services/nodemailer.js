import { NODEMAILER_PASS, NODEMAILER_USER } from "../config/config.js";
import nodemailer from 'nodemailer'


export const getBill = async (ticket, userMail) => {
    try {
      let config = {
        service: 'gmail',
        auth: {
          user: NODEMAILER_USER,
          pass: NODEMAILER_PASS
        }
      };
      
      let transporter = nodemailer.createTransport(config);

      const productsHTML = ticket.products && Array.isArray(ticket.products)
      ? ticket.products.map(product => `
          <p><strong>${product.name}</strong>: ${product.price}</p>
          <p>Quantity: ${product.quantity}</p>
      `).join('')
      : ''; // Si ticket.products no es un array, asigna una cadena vacía

      
      
      let message = {
        from: NODEMAILER_USER,
        to: userMail,
        subject: 'Gracias por tu compra',
        html: `<b> El detalle de tu compra es... </b> 
        ${productsHTML}
        el total de la compra es ${ticket.amount}
        `
      }
  
        transporter.sendMail(message)

    } catch (err) {
      console.error('Error al enviar el correo electrónico:', err);

    }
  }
  