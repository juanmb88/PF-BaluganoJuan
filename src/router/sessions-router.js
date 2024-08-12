import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import { UsuariosDTO } from "../DTO/UsuarioDTO.js";
import dotenv from 'dotenv';
import { sendEmail } from '../helper/nodeMailer.js'; // Importa la función de envío de correo
import { UsersManager } from '../dao/userManager.js';

const usersManager = new UsersManager();

dotenv.config();
export const router = Router();


router.post('/register', (req, res, next) => {

    passport.authenticate('register', { session: false, failureRedirect: "/api/sessions/error",failureMessage: true }, async (err, usuario) => {
        try {
            if (err) {
                console.error("Error en la autenticación:", err);
                return next(err);
            }
             if (!usuario) {
                console.log("ya existe un usuario registrado con estos datos.");
                //console.log("Autenticación fallida, usuario no encontrado.");
                return res.redirect("/api/sessions/error");
            } 
            const { first_name, password, last_name } = req.body;
            await sendEmail(first_name, password, last_name); // Enviar el correo
            //return res.json({ message: `Usuario creado con éxito`});// Redirigir al response de thunder
            res.redirect('/login'); // Redirigir al login
        } catch (error) {
            console.error("Error al registrar el usuario:", error);
            next(error);
        }
    })(req, res, next);
});

router.post("/login", passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }), async (req, res, next) => {
    try {
        let { web } = req.body;
        let usuario = { ...req.user };
        delete usuario.password; // Evitamos que la contraseña quede guardada

        let token = jwt.sign(usuario, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
        res.cookie("CookiePrueba", token, { httpOnly: true }); // Enviamos desde el servidor la cookie

         // Siempre devuelve JSON en lugar de redirigir
         res.setHeader('Content-Type', 'application/json');
         return res.status(200).json({ payload: "Login correcto", usuario, token });
         if (web) {
         return  res.redirect("/");
        } else { 
            res.setHeader('Content-Type', 'application/json');
            return res.status(200).json({ payload: "Login correcto", usuario, token });
         } 
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await usersManager.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error en GET "/":', error);
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
});
router.get('/github', passport.authenticate('github', { session: false, scope: ['user:email'] }));

router.get("/devolucionGithub", passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }), async (req, res, next) => {
    try {
        const usuario = { ...req.user };
        const token = jwt.sign({ id: usuario._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" }); // Generar el token JWT

        res.cookie("CookiePrueba", token, { httpOnly: true }); // Enviar el token en una cookie
        return res.redirect('/'); // Redirigir al usuario a la página principal
    } catch (error) {
        next(error);
    }
});

router.get("/logout", (req, res, next) => {
    try {
        res.clearCookie("CookiePrueba");
        res.redirect('/login');
    } catch (error) {
        next(error);
    }
});

router.get("/error", (req, res, next) => {
    try {
        res.setHeader('Content-Type', 'application/json');

        return res.status(500).json({
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `Fallo al autenticar...!!!`
        });
    } catch (error) {
        next(error);
    }
});

router.get("/current", passport.authenticate("current", { session: false }), (req, res, next) => {
    try {
        let usuario = new UsuariosDTO(req.user);
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ usuario });
    } catch (error) {
        next(error);
    }
});

router.post('/restablecerContraseña', 
    passport.authenticate('restablecerContraseña'), 
    async (req, res, next) => {
      try {
        // Redirige a la página de login con un mensaje de éxito
        res.redirect('/login?mensaje=Contraseña+restablecida+correctamente');
      } catch (error) {
        next(error);
      }
});


export default router;
