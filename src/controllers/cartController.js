import { isValidObjectId } from "mongoose";
import { cartService } from "../services/CartService.js";
import { productService } from "../services/ProductService.js";
import { ticketService } from "../services/TicketService.js";
import { sendTicketDeCompraEmail } from '../helper/nodeMailer.js'; // Importa la función de envío de correo

export class CartController{

    static getAll = async (req, res) => {
        try {
          const response = await cartManager.getAllCarts();
          res.json(response);
        } catch (error) {
          console.log(error);
          res.send("Error al intentar crear el carrito");
        }
      }
    
    static getById = async (req, res) => {
        const { cid } = req.params;
        try {
          if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Enter valid cid/pid` });
          }
      
          const carrito = await cartService.getOneByPopulate({ _id: cid });
      
          if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Non-existent cart: id ${cid}` });
          }
      
          res.setHeader("Content-Type", "application/json");
          return res.status(200).json({ carrito });
        } catch (error) {
          res.status(500).send("Error trying to get cart");
        }
      }

    static createNewCart = async (req, res) => {
        try {
          const response = await cartService.createCart();
          res.json(response);
        } catch (error) {
          res.send("Error when trying to create cart");
        }
      }
    
    static addProductToCart = async( req,res ) => {

        let { cid, pid } = req.params

        if(!isValidObjectId(cid) || !isValidObjectId(pid)){
            res.setHeader('Content-Type','application/json')
            return res.status(400).json({error:`Ingrese cid / pid válidos`})
        }
      
        let carrito = await cartService.getOneBy({_id:cid})
        if(!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Carrito inexistente: id ${cid}`})
        }
      
        let product = await productService.getOneBy({_id:pid})
        if(!product){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`No existe producto con id ${pid}`})
        }
      
        let indiceProducto = carrito.products.findIndex(p=>p.product==pid)
        if(indiceProducto === -1){
          carrito.products.push({
            product: pid, quantity:1
          })
        }else{
          carrito.products[indiceProducto].quantity++
        }
        
        console.log(carrito, " console de carrito")
        let resultado = await cartService.update(cid, carrito)
        if(resultado.modifiedCount>0){
            res.setHeader('Content-Type','application/json');
            return res.status(200).json({payload:"Carrito actualizado, se agrego producto exitosamente"});
        }else{
            res.setHeader('Content-Type','application/json');
            return res.status(500).json(
                {
                    error:`Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle:`No se pudo realizar la actualizacion`
                }
            )}
      
      }

    static deleteProductByCart = async (req, res) => {
        const { cid, pid } = req.params;
        // Verifica si los IDs son válidos
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({ error: `Ingrese cid / pid válidos` });
        }
        try {
          await cartService.deleteProductByCartQuantity(cid, pid);
      
          res.json({
            payload: `Se redujo la cantidad del producto con ID: ${pid} en el carrito con ID: ${cid}`,
          });
        } catch (error) {
          return res.status(500).json({ error: `${error.message}` });
        }


        
      }
     
    static deleteCartById = async (req, res) => {
        let { cid } = req.params;
        if (!isValidObjectId(cid)) {
          return res.status(400).json({
            error: `Enter a valid MongoDB id`,
          });
        }
      
        if (!cid) {
          return res.status(300).json({ error: "Check unfilled fields" });
        }
      
        try {
          await cartService.deleteCartById(cid);
          res.setHeader("Content-Type", "application/json");
          res.json({ payload: `Carrito con ID :${cid} fue eliminado con exito` });
          //console.log("Carrito eliminado");
        } catch (error) {
          return res.status(500).json({ error: `${error.message}` });
        }
      }  


    static updateProduct = async (req, res) => {
        const { cId, pId } = req.params;
        if (!isValidObjectId(cId) || !isValidObjectId(pId)) {
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({ error: `Ingrese cid / pid válidos` });
        }
      
        try {
          let carrito = await cartService.getOneBy({ _id: cId });
          if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Carrito inexistente: id ${cId}` });
          }
      
          let productIndex = carrito.products.findIndex((p) => p.product == pId);
          if (productIndex === -1) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `El producto con id ${pId} no está en el carrito` });
          }
      
          const { quantity } = req.body;
      
          if (quantity <= 0) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `La cantidad debe ser mayor que cero` });
          }
      
          carrito.products[productIndex].quantity = quantity;
      
          const resultado = await cartService.update(cId, carrito);
          if (resultado.modifiedCount > 0) {
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ payload: "Producto en el carrito actualizado" });
          } else {
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({
              error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
              detalle: `No se pudo realizar la actualizacion`,
            });
          }
        } catch (error) {
          return res.status(500).json({ error: `${error.message}` });
        }
      }  

      static purchase = async (req, res) => {
        let cid = req.params.cid; 
        let usuario = req.user;
        let productosConStock = [];
        let productosSinStock = [];

        try {
        
            const cart = await cartService.getCartById(cid); 

            if (!cart) {
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
            // Verifico stock del producto
             for (let i = 0; i < cart.products.length; i++) { 
                let product = await productService.getProductsByFiltro(cart.products[i].product._id); 
                if (!product) {
                    return res.status(404).json({ message: `Id de producto : ${cart.products[i].product._id} no encontrado` });
                }

                if (cart.products[i].quantity <= product.stock) {
                    let nuevoStock = { stock: product.stock - cart.products[i].quantity };
                    await productService.updateProduct(cart.products[i].product._id, nuevoStock);
                    productosConStock.push(cart.products[i])//agrego a la lista creada
                    console.log("Producto  añadido:", cart.products[i]);
                } else {
                    productosSinStock.push(cart.products[i]);
                    console.log("Producto no facturable añadido:", cart.products[i]);
                }
            }
            //FIN Verifico stock del producto
            console.log("Productos para facturar:", productosConStock);
            console.log("Productos sin stock restantes:", productosSinStock);

            // Obtengo el precio total de la compra, se agraga cantidad de item en el calculo
            const precioTotal = productosConStock.map(item => ({
              price: item.product.price * item.quantity,
              quantity: item.quantity,
              product: item.product._id
          }));
  
          const total = precioTotal.reduce((acumulador, valorActual) => acumulador + valorActual.price, 0);
  
          const cantidadesPorUnidad = precioTotal.reduce((acumulador, valorActual) => {
              acumulador[valorActual.product] = valorActual.quantity;
              return acumulador;
          }, {});
  
          console.log("Total a pagar:", total);
          console.log("Cantidades por unidad:", cantidadesPorUnidad);

            //actualizo carrito
            await cartService.update(cart._id, { products: productosSinStock });

           //ticket a dar...
            const compraFinal = {
                purchaser: usuario.email,
                code: Math.floor(Math.random() * 100000),
                amount: total,
                products: productosConStock.map(item => ({
                  product: item.product._id, 
                  quantity: item.quantity 
                })),
                purchase_datetime: Date.now(),
            };
            await sendTicketDeCompraEmail(usuario.email, compraFinal.code, compraFinal.amount);

            console.log("Datos de compra:", compraFinal);

            let ticket = await ticketService.create(compraFinal);

            console.log("Ticket creado:", ticket);

            res.setHeader("Content-Type", "application/json");
            return res.status(201).json(ticket);
        } catch (error) {
            console.error("Error procesando compra:", error);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json("Error inesperado en el servidor al procesar la compra");
        }
    }
}