import jwt from 'jsonwebtoken';
import { SECRET } from '../utils.js';
/* export const auth=(req, res, next)=>{
    if(!req.session.usuario){
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`No existen usuarios autenticados`})
    }

    next()
}

export const sessionOn = (req,res,next)=>{
    if(req.session.usuario){
        return  res.redirect("/profile")
    }

    next()
} */

/* export const authToken = (req,res,next )=>{
    
    if(!req.headers.authorization){//pregunto por si vienen algo en el header
        res.setHeader('Content-Type','application/json');
        return res.status(401).json({error:`Usuario no autenticado`})
    }
    next()
} */

export const authTokenPermisos = (permissions = []) => {
	// auth(["admin", "user"])  o  auth(["admin"])
	return (req, res, next) => {
		permissions = permissions.map((p) => p.toLowerCase());

		if (permissions.includes("public")) {
			return next();
		}

		if (!req.user?.rol) {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(401)
				.json({ error: `No hay usuarios autenticados, o problema con el rol` });
		}

		if (!permissions.includes(req.user.rol.toLowerCase())) {
			res.setHeader("Content-Type", "application/json");
			return res
				.status(403)
				.json({ error: `Acceso denegado por rol insuficiente` });
		}

		return next();
	};
};

export  const authToken = (req, res, next) => {
    const token = req.cookies.CookiePrueba; // Asegúrate de que el nombre de la cookie es correcto
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded; // Aquí se guarda el usuario decodificado en req.user
        next();
    });
};

