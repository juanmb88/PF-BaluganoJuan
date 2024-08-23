import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {logger } from "../helper/Logger.js"
import { usuarioModelo } from '../dao/models/usuarioModelo.js';

dotenv.config(); 

export const authTokenPermisos = (permisos = []) => {
    return async (req, res, next) => {
        try {
            const haceUnMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            await usuarioModelo.deleteMany({ last_connection: { $lt: haceUnMes } });
            logger.info('Usuarios inactivos eliminados.');

            permisos = permisos.map((p) => p.toLowerCase());

            if (permisos.includes("public")) {
                return next();
            }

            if (!req.user?.role) {
                logger.warn(`Intento de acceso sin rol autorizado: ${req.user}`);
                res.setHeader("Content-Type", "application/json");
                return res.status(401).json({ error: `No tienes los roles permitidos para acceder a esta información` });
            }

            if (!permisos.includes(req.user.role.toLowerCase())) {
                logger.warn(`Acceso denegado por rol insuficiente: ${req.user.role}`);
                res.setHeader("Content-Type", "application/json");
                return res.status(403).json({ error: `Acceso denegado por rol insuficiente` });
            }

            logger.info(`Acceso autorizado para usuario con rol: ${req.user.role}`);
            return next();
        } catch (error) {
            logger.error('Error al eliminar usuarios inactivos:', error);
            return res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    };
};

export const authToken = (req, res, next) => {
    const token = req.cookies.CookiePrueba; 
    if (!token) {
        return res.status(401).json({ message: 'Token no provisto' });
}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Fallo al autenticar token' });
        }
        req.user = decoded;
        next();
    });
};
