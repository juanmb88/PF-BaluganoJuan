import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import multer from 'multer';
import passport from 'passport';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__dirname)
export default __dirname;



//funcion para admitir imganes  y archivos de texto
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads')
    },
    filename: function (req, file, cb) {
       
        let tipo=file.mimetype.split("/")[0]
        if(tipo!=="image"){
            return cb(new Error("Solo se admiten imagenes...!"))
        } 

        cb( null, Date.now() + "-" + file.originalname )

    }
})

export const upload = multer({ storage: storage });

export const SECRET = "CoderCoder123"
export const generaHash = password => bcrypt.hashSync( password, bcrypt.genSaltSync(10) );
export const validaPassword = (password, hash) => bcrypt.compareSync( password, hash );

//PASSPORT 
export const passportCall=(estrategia)=>{
    return function (req, res, next) {
        passport.authenticate(estrategia, function (err, user, info, status) {
            if (err) { return next(err) }  // desde passport.config devuelvo return done(error)
            if (!user) { // desde passport.config devuelvo return done(null, false, {message:"valor..."})
                res.setHeader('Content-Type','application/json');
                return res.status(401).json({error:info.message?info.message:info.toString()})
            } 
            req.user=user; // desde passport.config devuelvo return done(null, usuario)
            return next()
        })(req, res, next);
    }
}