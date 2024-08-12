/*Aca vamos a almacenar todas nuestras estrategias de autenticacion para el proyecto, ej, registro y login, autet. por terceros, JWT*/
import  passport  from "passport";
import local from 'passport-local';
import passportJWT from "passport-jwt";
import github from "passport-github2";
import { UsersManager as UsuariosManager } from '../dao/userManager.js';
import {CartManager} from '../dao/cartManager.js'
import  {generaHash, validaPassword}  from "../utils.js";
import dotenv from 'dotenv';
import { logger } from "../helper/Logger.js";

dotenv.config();
const usuariosManager = new UsuariosManager();
const cartManager = new CartManager();

const buscaToken = (req) => {
	let token = null;
	if (req.cookies["CookiePrueba"]) { 
        token = req.cookies["CookiePrueba"];
     }
	return token;
};

export const initPassport =()=>{
        passport.use(//CONFIGURACION DEL CURRENT
            "current",
            new passportJWT.Strategy(
                {
                    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
                    jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([ buscaToken ]),
                },

                async (usuarioToken, done) => {
                    try {
                        if(!usuarioToken.email === " " || !usuarioToken.password === " "){
                            logger.warn('Email y Password son obligatorios en el token JWT.');
                            return done(null, false, {message : "Email y Password son obligatorios"})
                        }
                        
                        return done(null, usuarioToken);//token con datos del user

                    } catch (error) {
                        logger.error('Error durante la autenticación con JWT', { error: error.message });
                        return done(error);
                    }
                }
            )
	   );
        passport.use(//CONFIGURACION DEL REGISTRO
            'register',
            new local.Strategy(
                {
                    usernameField : "email",
                    passReqToCallback : true
                },// 1er argumrento objeto de config para la estrategia
                async ( req, username, password, done )=>{//funcion callback, los arg. depende de el primer argumento, siempre async y el done
                    try{
                        let {first_name, last_name, age }=req.body;
                        if(!first_name){
                        return done(null, false,{ message: 'Nombre es requerido' });
                        }
                    
                        let existe = await usuariosManager.getByOne({ email : username });

                        if(existe){
                            return done(null,false,{ message: 'El email ya está registrado' });
                        }

                        let nuevoCarrito= await cartManager.createCart();
                        password=generaHash(password); // otras validaciones  
                    
                        let nuevoUsuario = await usuariosManager.create({
                            first_name,
                            last_name, 
                            email:username, 
                            age, 
                            password, 
                            role: 'user',
                            carrito: nuevoCarrito._id
                        });
                  
                         logger.info(`Nuevo usuario registrado: ${nuevoUsuario.email}`);// Registrar el nuevo usuario creado
                         return done(null,nuevoUsuario);   
                    } catch (error) {
                        logger.error('Error al registrar nuevo usuario', { error: error.message });
                        return done(error);
                    }        
            })
    );
        passport.use(//CONFIGURACION DEL LOGIN
            'login',
            new local.Strategy(
                {
                    usernameField : "email",
                },
                async(username, password, done ) => {
                   try {
                    // Registrar el inicio del proceso de autenticación
                     logger.info(`Intento de inicio de sesión para el usuario ${username}`);

                    let usuario = await usuariosManager.getByPopulate({email:username});
                        if(!usuario){//si no llega usuario
                            logger.warn(`Usuario ${username} no encontrado`);
                           return done(null, false);
                        }

                        if(!validaPassword(password, usuario.password )){//si no  llega clave  con el hash
                           logger.warn(`Contraseña incorrecta para el usuario ${username}`);
                           return done(null, false);
                             
                        }//fin de validacion en 2 etapas
                        delete usuario.password //quito dato antes de que sea devuelto

                        logger.info(`Usuario ${username} autenticado con éxito`);// Registro de éxito en la autenticación
                        return done(null, usuario);

                   } catch (error) {
                        logger.error(`Error durante el inicio de sesión para el usuario ${username}`, { error: error.message });
                        return done(error)
                   } 
                }
            )
    );
        passport.use(//CONFIGURACION DEL LOGIN CON GIT HUB
            'github',
            new github.Strategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.GITHUB_CALLBACK_URL
                },

                async(tokenAcceso, tokenRefresh, profile, done)=>{

                     try {
                        let email = profile._json.email;
                        let first_name = profile._json.name;

                        if (!first_name || !email) {
                            logger.warn('Perfil de GitHub incompleto. Nombre o email no disponibles.');
                            return done(null, false);
                        }

                    let usuario = await usuariosManager.getByPopulate({email});
                    
                    if(!usuario){
                        let nuevoCarrito = await cartManager.createCart()
                        usuario = await usuariosManager.create({
                            first_name, email, profile, carrito: nuevoCarrito._id
                        })

                         usuario = await usuariosManager.getByPopulate({email});
                    }
                     // Registrar el inicio de sesión con GitHub
                     logger.info(`Inicio de sesión exitoso con GitHub para el usuario ${usuario.email}`);
                    return done(null, usuario);

                    } catch (error) {
                        logger.error('Error durante la autenticación con GitHub', { error: error.message });
                        return done(error);
                    }
                }
            )
    );      
};