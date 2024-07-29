import { Router } from 'express';
import  productController from '../dao/productManager.js';
import {CartManager} from '../dao/cartManager.js';
import { authTokenPermisos } from "../middleware/auth.js"
import passport from 'passport';
import jwt from "jsonwebtoken"
import { passportCall, SECRET } from '../utils.js';
import { logger } from '../helper/Logger.js';
export const router = Router();

const productManager = new productController();
const cartManager = new CartManager();

//////////////REAL TIME PRODUCTS/////////
router.get('/realTimeproducts', passport.authenticate('current', { session: false }), authTokenPermisos(['admin', 'premium']), async (req, res) => {
    res.status(200).render('realTimeProducts');
});

////////////////////////VISTA INICIO/////////////
router.get('/',passport.authenticate("current", {session : false}), async (req, res) => {
    try {

        
        let { pagina, query, sort } = req.query;
        if (!pagina) pagina = 1;        // Si no se proporciona una página, usar la página 1
        
        const { docs: listOfProducts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getAllPaginate(pagina);

        let filteredProducts = listOfProducts;// Aplicar el filtro si se proporciona

        if (query) {
            // Filtrar los productos donde título coincida con el valor de query
            filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
        }

        // Ordenar los productos si se especifica el tipo de ordenamiento
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        }
        // MENSAJE DE BIENVENIDA
        let mensajeBienvenida = null;
        const usuarioEnSesion = req.user;

        // Verificar si el mensaje de bienvenida ya se ha mostrado para no repetirlo
         if (usuarioEnSesion && !req.cookies.mensajeBienvenidaMostrado) {
            mensajeBienvenida = `¡Bienvenido de nuevo:  ${usuarioEnSesion.first_name}!`;
            req.cookies.mensajeBienvenidaMostrado = true;
        }  
        let carrito = null;
        if (usuarioEnSesion && usuarioEnSesion.carrito) {
            if (typeof usuarioEnSesion.carrito === 'object' && usuarioEnSesion.carrito._id) {
                carrito = { _id: usuarioEnSesion.carrito._id };
            } else {
                carrito = { _id: usuarioEnSesion.carrito };
            }
        }
        logger.info('Página de inicio cargada con éxito', { usuario: usuarioEnSesion ? usuarioEnSesion.email : 'no logueado' });
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('inicio',{
            carrito,
            mensajeBienvenida :mensajeBienvenida,
            listOfProducts: filteredProducts, // Usar los productos filtrados y ordenados
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            login : req.user
        });
    } catch (error) {
        logger.error('Error al obtener los productos paginados:', { error: error.message });
        res.status(500).send('Error interno del servidor');
    }
});

////////////////////////PAGINACION/////////////
router.get('/paginacion', async (req, res) => {
    try {
        let { page, query, sort } = req.query;

        // Obtener los productos paginados
        const { docs: listOfProducts, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage } = await productManager.getAllPaginate(page);

        // Aplicar el filtro si se proporciona
        let filteredProducts = listOfProducts;
        if (query) {
            // Filtrar los productos donde título coincida con el valor de query
            filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
        }

        // Ordenar los productos si se especifica el tipo de ordenamiento
        if (sort === 'asc') {
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sort === 'desc') {
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        }
        logger.info('Productos paginados obtenidos con éxito', { totalPages, hasPrevPage, hasNextPage });

        // Enviar la respuesta JSON si no se solicita la vista HTML
        if (req.accepts('json')) {
            logger.info('Enviando respuesta JSON');
            return res.status(200).json({
                status: "success",
                payload: filteredProducts,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: "En construcción",
                nextLink: "En construcción"
            });
        }

        // Renderizar la vista HTML si no se solicita la respuesta JSON
        logger.info('Renderizando la vista HTML');
        res.status(200).render('inicio', {
            listOfProducts: filteredProducts, // Usar los productos filtrados y ordenados
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        });
    
    } catch (error) {
        logger.error('Error al obtener los productos paginados:', { error: error.message });
        res.status(500).send('Error interno del servidor');
    }
});

//VISTA CARRITO INDIVIDUAL
router.get("/carrito/:cid", passport.authenticate("current", {session : false}),  async (req, res) => {
    let { cid } = req.params
    let products

    logger.info('Solicitud recibida para obtener carrito', { cid });
    try {
        let carrito = await cartManager.getOneByPopulate({ _id: cid });
        if (!carrito) {
            logger.warn('Carrito no encontrado', { cid });
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        products = carrito.products;

        logger.info('Carrito encontrado y productos obtenidos', { cid, productCount: products.length });
        res.setHeader("Content-Type", "text/html")
        res.status(200).render("carrito",{ carrito, products });
    } catch (error) {
        logger.error('Error al obtener el carrito', { cid, error: error.message });
        res.setHeader("Content-Type", "application/json");
        res.status(500).json({ Error: "Error 500 - Error inesperado en el servidor" });       
    }
    
})

//VISTA DE REGISTRO
router.get('/register', (req, res) => {
    try {
        logger.info('Acceso a la ruta de registro');//Registrar acceso a registro
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("register");
    } catch (error) {
        logger.error('Error al renderizar la página de registro', { error: error.message });// Registrar errores al renderizar
        res.status(500).send('Error interno del servidor');
    }
});
    
//VISTA DE LOGIN PARA EL USUARIO
router.get('/login', (req, res) => {
    try {
        let { error, mensaje } = req.query;
        logger.info('Acceso a la ruta de login');// Registrar acceso a login
        res.status(200).render('login', { error, mensaje, login: req.user });
    } catch (error) {
        logger.error('Error al renderizar la página de login', { error: error.message });// Registrar errores al renderizar 
        res.status(500).send('Error interno del servidor');
    }
});

//VISTA PERFIL DEL USUARIO
router.get('/profile', passportCall("current"), (req, res) => {
    try {
        const usuario = req.user;
        // Registrar acceso a la ruta de perfil y el usuario que está accediendo
        logger.info(`Acceso a la ruta de perfil para el usuario ${usuario.email}`);
        res.setHeader("Content-Type", "text/html");
        res.status(200).render("profile", { usuario, login: usuario });
    } catch (error) {
        // Registrar errores al renderizar
        logger.error('Error al renderizar la página de perfil', { error: error.message });
        res.status(500).send('Error interno del servidor');
    }
}); 
router.get('/olvideClave', (req, res) => {
    try {
        res.setHeader("Content-Type", "text/html");
        res.status(200).render('login'); 
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});

/* router.get("/crearNuevaClave/:token", async (req, res) => {
    // 1) Extraer token del req.params
    let token = req.params.token;
    
    // 2) Verificar la validez del token
    let decoded;
    try {
        decoded = jwt.verify(token, SECRET);
        console.log('Token válido y aún en vigencia:', decoded);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            console.error('El token ha expirado.');
        } else if (err.name === 'JsonWebTokenError') {
            console.error('El token no es válido.');
        } else {
            console.error('Error al verificar el token:', err);
        }
    }

    // 3) Redirigir la vista según la validez del token
    if (decoded) {
        res.setHeader("Content-Type", "text/html");
        return res.status(200).render("crearNuevaClave", decoded);
    } else {
        res.setHeader("Content-Type", "text/html");
        return res.status(200).render("login", {
            message: "Lo siento, el token expiró o es incorrecto, deberá repetir el procedimiento para restablecer la contraseña."
        });
    }
}); */


router.get("/crearNuevaClave/:token", async (req, res) => {
    let token = req.params.token;
    let decoded;

    try {
        decoded = jwt.verify(token, SECRET);
        console.log('Token válido y aún en vigencia:', decoded);
    } catch (err) {
        console.error('Error al verificar el token:', err);
        return res.status(400).render("login", {
            message: "Lo siento, el token expiró o es incorrecto, deberá repetir el procedimiento para restablecer la contraseña."
        });
    }

    // Renderizar la vista de restablecimiento de contraseña si el token es válido
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("corroborarNuevaClave", { token });
});


router.get('/error', (req, res) => {
    res.status(500).render('error', { message: "Error interno del servidor" });
});