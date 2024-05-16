import { Router } from 'express';
import { UsuariosManagerMongo as UsuariosManager } from '../dao/userManagerMONGO.js';
import { generaHash } from '../utils.js';
import CartManager from '../dao/cartManagerMONGO.js';
import {usuarioModelo} from "../dao/models/usuarioModelo.js"

export const router=Router()

const cartManager = new CartManager();
const usuariosManager = new UsuariosManager();

router.post('/register', async(req,res)=>{

    let {nombre, email, password, web}=req.body
    if(!nombre || !email || !password){
        if(web){
            return res.redirect(`/register?error=Complete nombre, email, y password`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete nombre, email, y password`})
        }
    }

    let existe=await usuariosManager.getBy({email})
    if(existe){
        if(web){
            return res.redirect(`/register?error=Ya existe ${email}`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Ya existe ${email}`})
        }
    }

    // otras validaciones

    password=generaHash(password)

    try {
        let carritoNuevo = await cartManager.createCart()
        let nuevoUsuario = await usuariosManager.create({nombre, email, password, rol:"user", carrito:carritoNuevo._id})
        if(web){
            return res.redirect(`/login?mensaje=Registro correcto para ${nombre}`)
        }else{
            res.setHeader('Content-Type','application/json')
            res.status(200).json({
                message:"Registro correcto...!!!", nuevoUsuario
            })
        }
    } catch (error) {
        console.log(error);
        res.setHeader('Content-Type','application/json');
        return res.status(500).json(
            {
                error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle:`${error.message}`
            }
        )
    }

})

router.post("/login", async(req, res)=>{
    let { email, password, web}=req.body

     let user = await usuarioModelo.findOne({email});

    if (!user || user.password !== password) {
        return res.status(401).send("Unauthorized");
      }

      res.cookie("user", user, { signed: true });
      req.session.user = user;
    
        if(req.session.user.email === "adminCoder@coder.com" ){
            req.session.admin = true
        }else{
            req.session.admin = false   
        }
      res.status(200).json({message:"Registro correcto...!!!", nuevoUsuario})





    if(!email || !password){
         if(web){
            return res.redirect(`/login?error=Complete email, y password`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Complete email, y password`})
        } 
    }
    // preguntar por adminCoder@coder.com, y la contraseña  si son esos datos, devolves al usuario nombre "admin", email adminCoder@coder.com y rol "admin"
if(email === "adminCoder@coder.com" && password === "adminCod3r123" ){

    let nuevoUsuario=await usuariosManager.create({nombre:"admin", email:"adminCoder@coder.com", password:generaHash(password), rol :"admin"})

    res.setHeader('Content-Type','application/json')
    res.status(200).json({message:"Registro correcto...!!!", nuevoUsuario})
}
       
    let usuario = await usuariosManager.getBy({email, password:generaHash(password)})
    if(!usuario){

        if(web){
            return res.redirect(`/login?error=Credenciales invalidas`)
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Credenciales inválidas`})
        } 
    }

        usuario={...usuario} 
        delete usuario.password// aca evito que quede guardo el password del user
        req.session.usuario=usuario//aca se guardan los datos del usuario logueado 


     if(web){
        res.redirect("/")
    }else{
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"Login correcto", usuario});
    } 

}) 

router.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.error(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: 'Error inesperado en el servidor - Intente más tarde, o contacte a su administrador',
                detalle: error.message
            });
        }
       res.redirect('/login');
    });
});
