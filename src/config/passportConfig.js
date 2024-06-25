/*Aca vamos a almacenar todas nuestras estrategias de autenticacion para el proyecto, ej, registro y login, autet. por terceros, JWT*/
import  passport  from "passport";
import local from 'passport-local';
import passportJWT from "passport-jwt";
import github from "passport-github2";
import { UsersManager as UsuariosManager } from '../dao/userManager.js';
import {CartManager} from '../dao/cartManager.js'
import  {generaHash, validaPassword}  from "../utils.js";
import dotenv from 'dotenv';
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
//CONFIGURACION DEL CURRENT
        passport.use(
		"current",
		new passportJWT.Strategy(
			{
				secretOrKey: process.env.ACCESS_TOKEN_SECRET,
				jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
					buscaToken,
				]),
			},
			async (usuarioToken, done) => {
				try {
                    if(usuarioToken.email === " " || usuarioToken.password === " "){
                        return done(null, false, {message : "Email y Password son obligatorios"})
                    }
                    
					return done(null, usuarioToken);//token con datos del user
				} catch (error) {
					return done(error);
				}
			}
		)
	);

//CONFIGURACION DEL REGISTRO
        passport.use(
            'register',//nombre de la estrategia
            new local.Strategy(//definicion de la estrategia (passport-local)
                {//primer argumento de paramtero
                    usernameField : "email",
                    passReqToCallback : true
                },// 1er argumrento objeto de config para la estrategia
                async ( req, username, password, done )=>{//funcion callback, los arg. depende de el primer argumento, siempre async y el done
                    try{
                        let {first_name, last_name, age }=req.body;
                        if(!first_name){
                        return done(null, false,{ message: 'Nombre es requerido' });
                        }
                    
                        let existe = await usuariosManager.getBy({ email : username });
                        if(existe){
                            return done(null,false,{ message: 'El email ya está registrado' })//si existe estaria repetido, error
                        }
                        let nuevoCarrito= await cartManager.createCart()
                        password=generaHash(password) // otras validaciones  
                    
                        let nuevoUsuario = await usuariosManager.create({
                            first_name,
                            last_name, 
                            email:username, 
                            age, 
                            password, 
                            role: 'user',
                            carrito: nuevoCarrito._id
                        })
                  
                        console.log(nuevoUsuario)
                                return done(null,nuevoUsuario)
                    
                    } catch (error) {
                        return done(error)
                    }        
                })
    );

//CONFIGURACION DEL LOGIN
        passport.use(
            'login',
            new local.Strategy(
                {
                    usernameField : "email",
                },
                async(username, password, done ) => {
                   try {
             

                    let usuario = await usuariosManager.getByPopulate({email:username})
                        if(!usuario){//si no llega usuario
                           return done(null, false)
                        }

                        if(!validaPassword(password, usuario.password )){//si no  llega clave  con el hash
                           return done(null, false)
                             
                        }//fin de validacion en 2 etapas
                        // usuario={...usuario}
                        delete usuario.password //quito dato antes de que sea devuelto
                        return done(null, usuario)
                   } catch (error) {
                           return done(error)
                   } 
                }
            )
    );
//CONFIGURACION DEL LOGIN CON GIT HUB
        passport.use(
            'github',
            new github.Strategy(
                {
                    clientID: process.env.GITHUB_CLIENT_ID,
                    clientSecret: process.env.GITHUB_CLIENT_SECRET,
                    callbackURL: process.env.GITHUB_CALLBACK_URL

                },
                async(tokenAcceso, tokenRefresh, profile, done)=>{
                     try {
                        let email = profile._json.email
                        let first_name = profile._json.name
                        // console.log(profile)
                        if (!first_name || !email) {
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
                    
                    return done(null, usuario);
                    } catch (error) {
                        return done(error);
                    }
                }
            )
    );

};