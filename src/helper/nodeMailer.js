import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import { logger } from '../helper/Logger.js';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (first_name, password, last_name) => {

    const mailOptions = {
        from: 'JUAN <juanbalugano@gmail.com>',
        to: 'juanbalugano@gmail.com',
        subject: 'Bienvenido a nuestro E-commerce!!!',
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #333;">¡Bienvenido, ${first_name} ${last_name}!</h1>
        <p style="font-size: 18px; color: #555;">Nos complace darte la bienvenida a nuestra comunidad en nuestro E-commerce.</p>
        <p style="font-size: 16px; color: #555;">Tu cuenta ha sido creada exitosamente. A continuación, encontrarás tu contraseña para acceder a tu cuenta:</p>
        <div style="margin: 20px 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 5px;">
            <p style="font-size: 18px; color: #333;"><strong>Contraseña:</strong> ${password}</p>
        </div>
        <p style="font-size: 16px; color: #555;">Gracias por unirte a nosotros. ¡Esperamos que disfrutes de tu experiencia de compra!</p>
        <p style="font-size: 16px; color: #555;">Saludos,<br>El equipo de E-commerce</p>
    </div> `,
    };

    try {
        const resultado = await transporter.sendMail(mailOptions);
        logger.info('Correo de bienvenida enviado exitosamente', { resultado });
    } catch (error) {
        logger.error('Error al enviar el correo de bienvenida:', { error });
    }
};


export const sendTicketDeCompraEmail = async (to, code, amount) => {
    const mailOptions = {
        from: 'JUAN <juanbalugano@gmail.com>',
        to: 'juanbalugano@gmail.com',
        subject: 'Gracias por tu compra',
        html: `<h2>Hola, gracias por tu compra. Tu ticket generado es: ${code}, por un total de ${amount}</h2>`,
    };

    try {
        const resultado = await transporter.sendMail(mailOptions);
        logger.info('Correo de ticket de compra enviado exitosamente', { resultado });
    } catch (error) {
        logger.error('Error al enviar el correo de ticket de compra:', { error });
    }
};

export const enviarEmail = async (para, asunto, mensaje) => {
    return await transporter.sendMail(
      {
        from: "juanbalugano@gmail.com",
        to: para,
        subject: asunto,
        html: mensaje
      }
    )
}
