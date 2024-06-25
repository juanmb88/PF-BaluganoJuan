import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export const authTokenPermisos = (permisos = []) => {// auth(["admin", "user"])  o  auth(["admin"])

	return (req, res, next) => {
		permisos = permisos.map((p) => p.toLowerCase());

		if (permisos.includes("public")) {
			return next();
		}

		if (!req.user?.role) {//si existe usuario y rol 
			res.setHeader("Content-Type", "application/json");
			return res.status(401).json({ error: `No tienes los roles permitidos para acceder a esta informacion` });
		}

		if (!permisos.includes(req.user.role.toLowerCase())) {
			res.setHeader("Content-Type", "application/json");
			return res.status(403).json({ error: `Acceso denegado por rol insuficiente` });
		}

		return next();
	};
};

export const authToken = (req, res, next) => {
    const token = req.cookies.CookiePrueba; // Cambiar a signedCookies
    if (!token) {
        return res.status(401).json({ message: 'Token no provisto' });
}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Fallo al autenticar token' });
        }
        req.user = decoded; // Aquí se guarda el usuario decodificado en req.user
        next();
    });
};
