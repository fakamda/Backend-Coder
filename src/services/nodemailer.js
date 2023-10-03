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
      
      let message = {
        from: NODEMAILER_USER,
        to: userMail,
        subject: 'Gracias por tu compra',
        html: `<b> El detalle de tu compra es... </b> 
        ${ticket}
        `
      };
  
        transporter.sendMail(message)
    //   res.status(201).json({ success: true, message: 'El correo electrónico ha sido enviado exitosamente.', info });
    } catch (err) {
      console.error('Error al enviar el correo electrónico:', err);
    //   res.status(500).json({ success: false, message: 'Hubo un problema al enviar el correo electrónico.', error: err.message });
    }
  }
  