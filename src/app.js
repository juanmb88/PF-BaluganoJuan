import express from "express";
import path from "path"; 
import __dirname from "./utils.js"; 
import { engine } from "express-handlebars";
import connectDB from "./connection/MongoDB.js"
import MongoStore from "connect-mongo";
import { router as productRouter } from "./routes/products-router.js";
import { router as cartRouter } from "./routes/cart-router.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as sessionsRouter } from './routes/sessions-router.js';
import { router as cookieRouter } from './routes/cookie-router.js';
import sessions from "express-session";
import  dotenv from 'dotenv';
import  passport  from "passport";
import cookieParser from "cookie-parser";
import { initPassport } from "./config/passportConfig.js";
dotenv.config();

const port = 8080;
const app = express();

//middlewares 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//FIN middlewares 
//SESSION
app.use(sessions({
    secret:"CoderCoder123",
    resave:true,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: "mongodb+srv://user:1234@cluster.s4bt3ui.mongodb.net/",
        dbName : 'ecommerce',
        collectionName: "sessions",
        ttl: 3600
    })
}))
//FIN SESSION
//PASSPORT
initPassport();
app.use(passport.initialize());
app.use(passport.session());//esta linea solo si usamos sessions
//FIN PASSPORT
//CONECCION A MONGO DB
connectDB();
//CONECCION A MONGO DB 
//handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));
//FIN handlebars
//contenido estatico
app.use(express.static(path.join(__dirname,'/public')));
//FIN contenido estatico
//COOKIE
app.use(cookieParser("CoderBack")) 
//COOKIE
//RUTAS
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use("/",cookieRouter)
app.use('/', vistasRouter);//ruta de las vistas con handlebars
app.use('/',(req, res)=>{
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok")});
//FIN RUTAS
//Escucha del servidor
const serverHTTP= app.listen(port, ()=> console.log(`Server corriendo en http://localhost:${port}`));
serverHTTP.on('error', (err)=> console.log(err));
//FIN Escucha del servidor
 