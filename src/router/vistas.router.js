import { Router } from 'express';
import  productController from '../services/productManager.js';
import CartManager from '../services/cartManager.js';
import { authTokenPermisos } from "../middleware/auth.js"
import passport from 'passport';
import { passportCall } from '../utils.js';
export const router = Router();

const productManager = new productController();
const cartManager = new CartManager();

//////////////REAL TIME PRODUCTS/////////
 router.get('/realTimeproducts',passportCall("current"), authTokenPermisos(['admin']), async (req,res) => {
    res.status(200).render('realTimeProducts') 
}) ;

////////////////////////VISTA INICIO/////////////
router.get('/',passport.authenticate("current", {session : false}), async (req, res) => {
    try {
        let { pagina, query, sort } = req.query;
        // Si no se proporciona una página, usar la página 1
        if (!pagina) pagina = 1;
        
        // Obtener los productos paginados
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
          let carrito = {
            _id: usuarioEnSesion.carrito
        }  

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
        console.error('Error al obtener los productos paginados:', error);
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

        // Enviar la respuesta JSON si no se solicita la vista HTML
        if (req.accepts('json')) {
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
        res.status(200).render('inicio', {
            listOfProducts: filteredProducts, // Usar los productos filtrados y ordenados
            totalPages,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage
        });
    
    } catch (error) {
        console.error('Error al obtener los productos paginados:', error);
        res.status(500).send('Error interno del servidor');
    }
});

//VISTA CARRITO INDIVIDUAL
router.get("/carrito/:cid", passport.authenticate("current", {session : false}),  async (req, res) => {
    let { cid } = req.params
    console.log(cid)
    let products
    try {
        let carrito = await cartManager.getOneByPopulate({ _id: cid })
        if (!carrito) {
            return res.status(404).json({ error: "Carrito no encontrado" });
        }
        products = carrito.products
        res.setHeader("Content-Type", "text/html")
        res.status(200).render("carrito",{ carrito, products })
    } catch (error) {
        res.setHeader("Content-Type", "application/json")
        res.status(500).json({ Error: "Error 500 - Error inesperado en el servidor" })        
    }
    
})


//VISTA DE REGISTRO
router.get('/register', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.status(200).render("register");
});
    
//VISTA DE LOGIN PARA EL USUARIO
router.get('/login', (req,res)=>{
    let {error, mensaje} = req.query
    res.status(200).render('login', {error, mensaje, login : req.user})
})

//VISTA PERFIL DEL USUARIO
 router.get('/profile',passportCall("current"), (req, res) => {
    const usuario  = req.user;
    res.setHeader("Content-Type", "text/html")
    res.status(200).render("profile", { usuario, login: usuario });
}); 
