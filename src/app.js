import express from "express";
import path from "path"; 
import __dirname from "./utils.js"; 
import { engine } from "express-handlebars";
import connectDB from "./connection/MongoDB.js";
import { router as productRouter } from "./router/products-router.js";
import { router as cartRouter } from "./router/cart-router.js";
import { router as vistasRouter } from './router/vistas.router.js';
import { router as sessionsRouter } from './router/sessions-router.js';
import socketChat from "./socket/socketChat.js";
import socketProducts from './socket/socketProducts.js';
import { Server } from "socket.io";
import dotenv from 'dotenv';
import passport from "passport";
import cookieParser from "cookie-parser";
import { initPassport } from "./config/passportConfig.js";
import { configVarEntorno } from "./config/config.js";
import compression from "express-compression";

dotenv.config();

const app = express();
const port = configVarEntorno.PORT;

// Middlewares 
app.use(express.json());
app.use(compression({}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("CoderBack"));

// Passport
initPassport();
app.use(passport.initialize());

// Conexión a MongoDB
connectDB();

// Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

// Contenido estático
app.use(express.static(path.join(__dirname, '/public')));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter); // Ruta de las vistas con handlebars

// Ruta por defecto (Debe estar al final)

app.use((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok");
});

// Escucha del servidor
const serverHTTP = app.listen(port, () => console.log(`Server corriendo en http://localhost:${port}`));
serverHTTP.on('error', (err) => console.log(err));

// Socket
const socketServer = new Server(serverHTTP);
socketProducts(socketServer);
socketChat(socketServer);
