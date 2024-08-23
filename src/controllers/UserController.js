import { userService } from "../services/UserService.js";
import jwt from "jsonwebtoken";
import {  generaHash, validaPassword } from "../utils.js";
import { isValidObjectId } from "mongoose";
import dotenv from 'dotenv';
import { enviarEmail } from "../helper/nodeMailer.js";
import { logger } from "../helper/Logger.js";
dotenv.config();

const SECRET = process.env.ACCESS_TOKEN_SECRET;

export class UserController {

    static getRestablecerClave = async (req, res) => {
        let { email } = req.body;
        try {
            let usuario = await userService.checkEmail(email);
            if (Array.isArray(usuario)) {
                usuario = usuario[0];
            }
            if (usuario) {
                let token = jwt.sign({ _id: usuario._id }, SECRET, { expiresIn: "1h" });
                res.cookie("usercookie", token, { httpOnly: true });
                let estructuraHTML = `<h2>Haga click en el siguiente link para reestablecer su contraseña</h2>
                                      <a href="http://localhost:8080/crearNuevaClave/${token}">Restablecer contraseña</a>`;
                await enviarEmail(usuario.email, "Restablecimiento de contraseña CODER", estructuraHTML);
                res.setHeader("Content-Type", "text/html");
                res.status(200).json({ message: `<b>Abre tu correo en ${usuario.email} para restablecer su contraseña</b> `, token: token });
            } else {
                res.setHeader("Content-Type", "text/html");
                res.status(200).json("No existe el email requerido en nuestra DB");
            }
        } catch (error) {
            console.error("Error en getRestablecerClave:", error);
            res.setHeader("Content-Type", "application/json");
            res.status(500).json({ Error: "Error 500 - Error inesperado en el servidor al buscar el email del usuario" });
        }
    };
    
    static getCorroborarNuevaClave = async (req, res) => {
        if (!req.cookies.usercookie) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ message: "Ya fue realizada la modificación de la clave con éxito" });
        }
    
        let { password } = req.body;
        let token = req.params.token;
        let decoded;
    
        try {
            decoded = jwt.verify(token, SECRET);
        } catch (err) {
            logger.error("Error al verificar el token:", err.message);
            return res.status(400).json({ error: "El token no es válido." });
        }
    
        let id = decoded._id;
    
        try {
            let usuario = await userService.getUserById(id);
            if (!usuario) {
                logger.error("Usuario no encontrado con ID:", id);
                return res.status(404).json({ error: "Usuario no encontrado." });
            }
    
            if (!validaPassword(password, usuario.password)) { 
                logger.debug("Bien, la contraseña es diferente a la anterior, ahora la hasheamos y la actualizamos");
                let hashedPassword = generaHash(password);
                await userService.updatePassword(id, hashedPassword);
                logger.info(`Contraseña actualizada para el usuario ${usuario.email}: ${hashedPassword}`); 
                res.clearCookie("usercookie");
                res.setHeader("Content-Type", "text/html")
                res.status(400).json("<b>contraseña nueva confirmada con exito, ve al inicio de sesion</b>")

            } else {
                res.setHeader("Content-Type", "text/html");
                return res.status(400).json("La nueva contraseña no puede ser igual a la registrada en nuestra DB"); 
            }

        } catch (error) {
            logger.error("Error al actualizar la contraseña:", error);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({ error: "Error en el Servidor al querer actualizar la clave del usuario" }); 
        }
    };
    
    static getPremium = async (req, res) => {
        const id = req.params.uid;
    
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                message: "Error, el id requerido no tiene un formato válido de MongoDB"
            });
        }
    
        try {
            const usuario = await userService.getUserById(id);
            if (!usuario) {
                return res.status(400).json({
                    message: "No hay ningún usuario registrado con el id proporcionado"
                });
            }
            const nuevoRol = usuario.role === "usuario" ? "premium" : "usuario";
            const nuevoUsuario = await userService.updateRol(id, nuevoRol);
            if (!nuevoUsuario) {
                return res.status(500).json({ message: "Error al actualizar el rol del usuario" });
            }
    
            let nuevoUsuarioSinPassword = { ...nuevoUsuario };
            delete nuevoUsuarioSinPassword.password;
    
            res.clearCookie("codercookie", { httpOnly: true });
    
            let token = jwt.sign(nuevoUsuarioSinPassword, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
            res.cookie("codercookie", token, { httpOnly: true });
    
            return res.status(200).json(nuevoUsuarioSinPassword);
        } catch (error) {
            logger.error("Error al modificar el rol del usuario:", error);
            return res.status(500).json({ error: "Error en el Servidor al querer modificar el rol del usuario" });
        }
    };
    
    static uploadDocument = async (req, res) => {
        try {
       
          if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No se han subido archivos. Por favor, selecciona un archivo y vuelve a intentarlo." });
          }
      
          const userId = req.params.uid;
      
          const user = await usuarioModelo.findById(userId);
          if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
          }
      
          let updatedDocuments = [...user.documents];
          
          if (req.files['identificacion']) {
            updatedDocuments[0].reference = `uploads/profiles/${req.files['identificacion'][0].filename}`;
          }
          if (req.files['comprobanteProducto']) {
            updatedDocuments[1].reference = `uploads/products/${req.files['comprobanteProducto'][0].filename}`;
          }
          if (req.files['comprobanteEstadoDeCuenta']) {
            updatedDocuments[2].reference = `uploads/documents/${req.files['comprobanteEstadoDeCuenta'][0].filename}`;
          }
      
          user.documents = updatedDocuments;
          await user.save();
      
          return res.status(200).json({ message: "Documentos subidos y actualizados con éxito.", documents: updatedDocuments });
        } catch (error) {
          console.error("Error al subir los documentos:", error);
          return res.status(500).json({ error: "Error interno del servidor. Por favor, intenta nuevamente más tarde." });
        }
    };
}
  
    

