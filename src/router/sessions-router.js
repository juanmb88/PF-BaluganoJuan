import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import { UsuariosDTO } from "../DTO/UsuarioDTO.js";
import dotenv from 'dotenv';
import { sendEmail } from '../helper/nodeMailer.js'; // Importa la función de envío de correo

dotenv.config();
export const router = Router();

router.post('/register', (req, res, next) => {
    console.log("Solicitud de registro recibida:", req.body);

    passport.authenticate('register', { session: false, failureRedirect: "/api/sessions/error" }, async (err, usuario) => {
        try {
            if (err) {
                console.error("Error en la autenticación:", err);
                return next(err);
            }
            if (!usuario) {
                console.log("Autenticación fallida, usuario no encontrado.");
                return res.redirect("/api/sessions/error");
            }
            const { first_name, password, last_name } = req.body;
            await sendEmail(first_name, password, last_name); // Enviar el correo
            console.log("Usuario registrado con éxitoooo:", usuario);
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
        //res.status(500).render('error', { message: "Error interno del servidor" });

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
