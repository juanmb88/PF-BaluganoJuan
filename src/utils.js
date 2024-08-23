import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import mongoose from 'mongoose';
import multer from 'multer';
import passport from 'passport';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
import { TIPOS_ERROR } from "./utils/EnumeraErrores.js";
import swaggerJsdoc from "swagger-jsdoc";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      req.fileDoc = file.fieldname
      if(file.fieldname==="profile"){
        cb(null, './src/profiles')
        req.fileSavedPath = './src/profiles';
        req.fileSavedDoc = 'profile'
      } else {
        if(file.fieldname==="product"){
          cb(null, './src/products')
          req.fileSavedPath = './src/products';
          req.fileSavedDoc = 'product'
        } else {
          if(file.fieldname==="identificacion" || file.fieldname==="comprobanteProducto" || file.fieldname==="estadoDeCuenta"){
            cb(null, './src/documents')
            req.fileSavedPath = './src/documents';
                    req.fileSavedDoc = ''
          } 
          else {
            cb(null, './src/uploads')
            req.fileSavedPath = './src/uploads';
          }
        }
      }
    },
    filename: function (req, file, cb) {
        let type=file.mimetype.split("/")[0]
        if(type!=="image" && type!=="application"){
            return cb(new Error("Only images or documents admitted...!"))
        }
        const fileSavedName = Date.now()+"-"+file.originalname;
        cb(null, fileSavedName )
        req.fileSavedName = fileSavedName;
    }
    
  })
  
export const upload = multer({ storage })



export const passportCall=(estrategia)=>{
        return function (req, res, next) {
            passport.authenticate(estrategia, function (err, user, info, status) {
                if (err) { return next(err) }  
                if (!user) { 
                    res.setHeader('Content-Type','application/json');
                return res.status(401).json({error:info.message?info.message:info.toString()})
            } 
            req.user=user; 
            return next()
        })(req, res, next);
    }
};

export const SECRET = "CoderCoder123";
export const generaHash = password => bcrypt.hashSync( password, bcrypt.genSaltSync(10) );
export const validaPassword = (password, hash) => bcrypt.compareSync( password, hash );

export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id) && (new mongoose.Types.ObjectId(id)).toString() === id;
};
export class CustomError{
    static createError(name="Error", cause, message, code=TIPOS_ERROR.INTERNAL_SERVER_ERROR){
        const error=new Error(message, {cause:cause})
        error.name=name
        error.code=code

        throw error
    }
}

//SWAGGER
const options = {
    definition:{
        openapi: "3.0.0",
        info:{
            title:"Documentación Ecommerce con Swagger",
            version: "1.0.0",
            description:"Documentación Ecommerce"
        },
    },
 apis: ["./src/docs/Carrito.yaml","./src/docs/Productos.yaml"],
}

export const especificacionSwagger=swaggerJsdoc(options)
