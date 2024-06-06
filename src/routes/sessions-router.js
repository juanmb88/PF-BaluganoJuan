import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken"
import {  SECRET } from '../utils.js';
import { authToken } from '../middleware/auth.js';
export const router=Router()


//RUTA REGISTRO DE USUARIO
router.post('/register', async (req, res, next) => {
    passport.authenticate('register', { session: false, failureRedirect: "/api/sessions/error" }, async (err, usuario) => {
        try {
            if (err) {
                return next(err);
            }
            if (!usuario) {
                return res.redirect("/api/sessions/error");
            }
            res.redirect('/login');
        } catch (error) {
            console.error("Error en la ruta de registro:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    })(req, res, next);
});
 
//RUTA LOGIN DE USUARIO
router.post("/login", passport.authenticate("login", {session : false, failureRedirect:"/api/sessions/error"}), async(req, res)=>{
    //router.post("/login", passportCall("current"), async(req, res)=>{
    let { web }=req.body;
    let usuario = {...req.user};
    usuario = {...usuario}

   delete usuario.password;// aca evito que quede guardo el password del user
    
    let token = jwt.sign(usuario, SECRET, {expiresIn : "1h"})
	res.cookie("CookiePrueba", token, { httpOnly: true }); //enviamos desde el servidor cookie
        
     if(web){
        res.redirect("/")
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario,  token});
    } 
}); 

//RUTA de peticion a github
router.get("/github", passport.authenticate("github", {}), async()=>{
});
//RUTA devolucion de github
router.get("/devolucionGithub", passport.authenticate("github", { session: false, failureRedirect: "/api/sessions/error" }), async (req, res) => {
    try {
        const usuario = req.user;
        const token = jwt.sign({ id: usuario._id }, SECRET, { expiresIn: "1h" });// Generar el token JWT

        res.cookie("CookiePrueba", token, { httpOnly: true });// Enviar el token en una cookie

        return res.redirect('/');// Redirigir al usuario a la página principal

    } catch (error) {
        console.error("Error en la ruta /devolucionGithub:", error);
        return res.status(500).json({ error: "Error al procesar la autenticación con GitHub" });
    }
});

//RUTA DE LOGOUT PARA DESTRUIR UNA SESSION
router.get("/logout", (req, res) => {
  
    res.clearCookie("CookiePrueba");
    res.redirect('/login');

});

//RUTA ERROR
router.get("/error", (req, res)=>{
    res.setHeader('Content-Type','application/json');
    return res.status(500).json(
        {
            error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle:`Fallo al autenticar...!!!`
        }
    )
    
});

//RUTA DE CURRENT PARA DESAFIO INTEGRADOR II
router.get("/current", passport.authenticate("current", {session : false}), (req, res) => {
    const usuario = req.user;
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ usuario, login: usuario });
});
