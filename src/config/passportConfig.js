/*Aca vamos a almacenar todas nuestras estrategias de autenticacion para el proyecto, ej, registro y login, autet. por terceros, JWT 
PASO 1 toda la logica para que funciones nuestro register, PASO 2 configurar este archivo con nuestro app.js
PASO 3 hago la llamada de este middleware en mi ruta de sesion-router.js */
import  passport  from "passport";
import local from 'passport-local';
import github from "passport-github2";
import { UsuariosManagerMongo as UsuariosManager } from '../dao/userManagerMONGO.js';
import  {generaHash, validaPassword}  from "../utils.js";

const usuariosManager = new UsuariosManager();
//const cartManager = new CartManager();


export const initPassport =()=>{
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
                        let {nombre}=req.body;
                        if(!nombre){
                        return done(null, false,{ message: 'Nombre es requerido' });
                        }
                    
                        let existe = await usuariosManager.getBy({ email : username });
                        if(existe){
                            return done(null,false,{ message: 'El email ya está registrado' })//si existe estaria repetido, error
                        }
                    
                        // otras validaciones  
                        password=generaHash(password)
                    
                            let nuevoUsuario = await usuariosManager.create({nombre, email:username, password, rol:"user"})
                  
                                return done(null,nuevoUsuario)
                            
                    
                    } catch (error) {
                        return done(error)
                    }        
                })
    )


//CONFIGURACION DEL LOGIN
        passport.use(
            'login',
            new local.Strategy(
                {
                    usernameField : "email",
                },
                async(username, password, done ) => {
                   try {
                         
                    let usuario = await usuariosManager.getBy({email:username})
                        if(!usuario){//si no llega usuario
                           return done(null, false)
                        }

                        if(!validaPassword(password, usuario.password )){//si  llega usuario
                           return done(null, false)
                             
                        }//fin de validacion en 2 etapas
                        return done(null, usuario)
                   } catch (error) {
                           return done(error)
                   } 
                }
            )
        )
//CONFIGURACION DEL LOGIN CON GIT HUB
        passport.use(
            'github',
            new github.Strategy(
                {
                    clientID : "",
                    clientSecret : "",
                    callbackURL : "http://localhost:8080/api/sessions/devolucionGithub"

                },
                async(tokenAcceso, tokenRefresh, profile, done)=>{
                    try {
                         // console.log(profile)
                    let email = profile._json.email
                    let nombre = profile._json.name
                    if(!nombre || !email){
                        return done(null, false)
                    }
                    let usuario = await usuariosManager.getBy({email})
                    if(!usuario){
                        usuario = await usuariosManager.create({
                            nombre, email, profile
                        })
                    }

                    return done(null, usuario)
                    } catch (error) {
                        return done(error)
                    }
                }
            )
        )






    //PASO 1BIS solo si usamos sessions, config el serializar
    passport.serializeUser( (usuario, done) => {
        return done(null, usuario._id)
    });

    passport.deserializeUser( async (id, done) => {
        let usuario = await usuariosManager.getBy({_id : id})
        return done(null, usuario)
    });



};