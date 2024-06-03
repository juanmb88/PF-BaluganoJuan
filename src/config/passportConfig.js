/*Aca vamos a almacenar todas nuestras estrategias de autenticacion para el proyecto, ej, registro y login, autet. por terceros, JWT 
PASO 1 toda la logica para que funciones nuestro register, PASO 2 configurar este archivo con nuestro app.js
PASO 3 hago la llamada de este middleware en mi ruta de sesion-router.js */
import  passport  from "passport";
import local from 'passport-local';
import passportJWT from "passport-jwt";
import github from "passport-github2";
import { UsersController as UsuariosManager } from '../controllers/userController.js';
import CartManager from '../controllers/cartController.js'
import  {generaHash, SECRET, validaPassword}  from "../utils.js";

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
				secretOrKey: SECRET,
				jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([
					buscaToken,
				]),
			},
			async (usuarioToken, done) => {
				try {
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
    )
//CONFIGURACION DEL LOGIN CON GIT HUB
        passport.use(
            'github',
            new github.Strategy(
                {
                    clientID : "Iv23liJk69wGRbk6p4SZ",
                    clientSecret : "bdac66bf8d50bed5b440da4df0b66bdd18a5ecb7",
                    callbackURL : "http://localhost:8080/api/sessions/devolucionGithub"

                },
                async(tokenAcceso, tokenRefresh, profile, done)=>{
                    try {
                        let email = profile._json.email;
                        let first_name = profile._json.name;
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
    ) 

};