import { isValidObjectId } from "mongoose";
import { cartService } from "../services/CartService.js";
import { productService } from "../services/ProductService.js";
import { ticketService } from "../services/TicketService.js";
import {sendTicketDeCompraEmail } from '../helper/nodeMailer.js';
import { logger } from '../helper/Logger.js';


export class CartController{

  static getAll = async (req, res) => {
      try {
          const response = await cartService.getAllCarts();

          if (!response || response.length === 0) {
              return res.status(404).json({ message: 'No se encontraron carritos' });
          }

          res.json({ status: 'success', carts: response });
      } catch (error) {
          logger.error(`Error al intentar obtener todos los carritos: ${error.message}`);
          res.status(500).json({ error: 'Error al intentar obtener todos los carritos' });
      }
}
    
    static getById = async (req, res) => {
        const { cid } = req.params;
        try {
          if (!isValidObjectId(cid)) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Ingresa un ID valido` });
          }
      
          const carrito = await cartService.getOneByPopulate({ _id: cid });
      
          if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            logger.error(`Carrito con ID ${cid} inexistente: ${error.message}`);
            return res.status(400).json({ error: `No existe cart: id ${cid}` });
          }
      
          res.setHeader("Content-Type", "application/json");
          return res.status(200).json({ carrito });
        } catch (error) {
          logger.error(`Error al intentar obtener el carrito con ID ${cid}`);
          res.status(500).json({ error: `Error al intentar obtener el carrito con ID ${cid}, es inexistente` });
      }
      }

      static createNewCart = async (req, res) => {
        try {
            const response = await cartService.createCart();

            if (!response) {
                logger.warn('No se pudo crear el carrito');
                return res.status(400).json({ error: 'No se pudo crear el carrito' });
            }

            logger.info(`Nuevo carrito creado: ${response._id}`);
            res.status(201).json({ status: 'success', cart: response });
        } catch (error) {
            logger.error(`Error al intentar crear un nuevo carrito: ${error.message}`);
            res.status(500).json({ error: 'Error al intentar crear un nuevo carrito' });
        }
    }
    
    static addProductToCart = async (req, res) => {
        let { cid, pid } = req.params;
    
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            logger.error(`Ingrese cid / pid válidos: cid=${cid}, pid=${pid}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Ingrese cid / pid válidos` });
        }
    
        try {
            let carrito = await cartService.getOneBy({ _id: cid });
            if (!carrito) {
                logger.error(`Carrito inexistente: id ${cid}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `Carrito inexistente: id ${cid}` });
            }
    
            let product = await productService.getOneBy({ _id: pid });
            if (!product) {
                logger.error(`No existe producto con id ${pid}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(400).json({ error: `No existe producto con id ${pid}` });
            }
    
             // Verificar si el usuario tiene permiso para agregar el producto al carrito
              if (req.user.role === 'premium' && product.owner === req.user.email) {
                return res.status(403).json({ error: 'No puedes agregar tus propios productos al carrito' });
            }
            // Verificar si el producto tiene stock disponible
            if (product.stock < 1) {
              logger.warn(`El producto con id ${pid} no tiene stock disponible`);
              res.setHeader('Content-Type', 'application/json');
              return res.status(400).json({ error: `El producto con id ${pid} no tiene stock disponible` });
            }
            let indiceProducto = carrito.products.findIndex(p => p.product == pid);
            if (indiceProducto === -1) {
                carrito.products.push({ product: pid, quantity: 1 });
            } else {
                carrito.products[indiceProducto].quantity++;
            }
    
            logger.info(`Producto añadido al carrito: ${pid}`);
    
            let resultado = await cartService.update(cid, carrito);
            if (resultado.modifiedCount > 0) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(200).json({ payload: "Carrito actualizado, se agregó producto exitosamente" });
            } else {
                logger.error(`Error al actualizar el carrito con id ${cid}`);
                res.setHeader('Content-Type', 'application/json');
                return res.status(500).json({
                    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                    detalle: `No se pudo realizar la actualización`
                });
            }
        } catch (error) {
            logger.error(`Error en el servidor al procesar la solicitud: ${error.message}`);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({ error: `Error inesperado en el servidor: ${error.message}` });
        }
      }
    
    static deleteProductByCart = async (req, res) => {
        const { cid, pid } = req.params;

        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {// Verifica si los IDs son válidos
          logger.error(`Ingrese cid / pid válidos: cid=${cid}, pid=${pid}`);
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({ error: `Ingrese cid / pid válidos` });
        }
        try {
          const cart = await cartService.getCartById(cid);
          if (!cart || cart.products.length === 0) {
              logger.warn(`El carrito con ID ${cid} está vacío. No hay productos para borrar.`);
              res.setHeader("Content-Type", "application/json");
              return res.status(400).json({ error: `El carrito está vacío. No hay productos para borrar.` });
            }
          await cartService.decreaseProductQuantity(cid, pid);

          logger.info(`Cantidad del producto con ID ${pid} reducida en el carrito con ID ${cid}`);
          res.setHeader("Content-Type", "application/json");
          return res.status(200).json({
            payload: `Se redujo la cantidad del producto con ID: ${pid} en el carrito con ID: ${cid}`,
        });
        } catch (error) {
          logger.error(`Error al reducir cantidad del producto en carrito: ${error.message}`);
          res.setHeader("Content-Type", "application/json");
          return res.status(500).json({ error: `${error.message}` });
        }   
      }
     
      static deleteCartById = async (req, res) => {
        let { cid } = req.params;

        if (!isValidObjectId(cid)) {
            logger.error(`Ingrese un ID de MongoDB válido: cid=${cid}`);
            return res.status(400).json({
                error: `Ingrese un ID de MongoDB válido`,
            });
        }

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) {
                logger.warn(`Carrito no encontrado: ID ${cid}`);
                return res.status(404).json({ error: `Carrito no encontrado` });
            }

            await cartService.deleteCartById(cid);
            logger.info(`Carrito con ID ${cid} eliminado correctamente`);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ payload: `Carrito con ID: ${cid} fue eliminado con éxito` });
        } catch (error) {
            logger.error(`Error al eliminar carrito: ${error.message}`);
            return res.status(500).json({ error: `${error.message}` });
        }
    }

    static updateProduct = async (req, res) => {
        const { cId, pId } = req.params;
        if (!isValidObjectId(cId) || !isValidObjectId(pId)) {
          logger.error(`Ingrese cid / pid válidos: cId=${cId}, pId=${pId}`);
          res.setHeader("Content-Type", "application/json");
          return res.status(400).json({ error: `Ingrese cid / pid válidos` });
        }
      
        try {
          let carrito = await cartService.getOneBy({ _id: cId });
          if (!carrito) {
            logger.error(`Carrito inexistente: id ${cId}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Carrito inexistente: id ${cId}` });
          }
      
          let productIndex = carrito.products.findIndex((p) => p.product == pId);
          if (productIndex === -1) {
            logger.error(`El producto con id ${pId} no está en el carrito`);
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `El producto con id ${pId} no está en el carrito` });
          }
      
          const { quantity } = req.body;
      
          if (quantity <= 0) {
            logger.error(`La cantidad debe ser mayor que cero: cantidad=${quantity}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `La cantidad debe ser mayor que cero` });
          }
      
          carrito.products[productIndex].quantity = quantity;
      
          const resultado = await cartService.update(cId, carrito);
          if (resultado.modifiedCount > 0) {
            logger.info(`Producto en el carrito actualizado: cId=${cId}, pId=${pId}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(200).json({ payload: "Producto en el carrito actualizado" });
          } else {
            logger.error(`Error inesperado en el servidor al actualizar el carrito: cId=${cId}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json({
              error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
              detalle: `No se pudo realizar la actualizacion`,
            });
          }
        } catch (error) {
          logger.error(`Error al procesar la solicitud: ${error.message}`);
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
                logger.warn(`Carrito no encontrado: id=${cid}`);
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
    
            for (let i = 0; i < cart.products.length; i++) { 
                let product = await productService.getProductsByFiltro(cart.products[i].product._id); 
                if (!product) {
                    logger.warn(`Producto no encontrado: id=${cart.products[i].product._id}`);
                    return res.status(404).json({ message: `Id de producto : ${cart.products[i].product._id} no encontrado` });
                }
    
                if (cart.products[i].quantity <= product.stock) {
                    let nuevoStock = { stock: product.stock - cart.products[i].quantity };
                    await productService.updateProduct(cart.products[i].product._id, nuevoStock);
                    productosConStock.push(cart.products[i]);
                    logger.info(`Producto con stock suficiente añadido: id=${cart.products[i].product._id}, cantidad=${cart.products[i].quantity}`);
                } else {
                    productosSinStock.push(cart.products[i]);
                    logger.warn(`Producto sin stock suficiente añadido: id=${cart.products[i].product._id}, cantidad=${cart.products[i].quantity}`);
                }
            }
     // Si no hay productos con stock suficiente, abortar la compra
     if (productosConStock.length === 0) {
      logger.warn('Compra abortada: no hay productos con stock suficiente');
      return res.status(400).json({
          message: "No se puede completar la compra. Los siguientes productos no tienen stock suficiente.",
          productosSinStock
      });
  }

            logger.info(`Productos para facturar: ${JSON.stringify(productosConStock)}`);
            logger.info(`Productos sin stock restantes: ${JSON.stringify(productosSinStock)}`);
    
            const precioTotal = productosConStock.map(item => ({
                price: item.product.price * item.quantity,
                quantity: item.quantity,
                product: item.product._id
            }));
    
            const total = precioTotal.reduce((acumulador, valorActual) => acumulador + valorActual.price, 0);
          /*   const cantidadesPorUnidad = precioTotal.reduce((acumulador, valorActual) => {
                acumulador[valorActual.product] = valorActual.quantity;
                return acumulador;
            }, {});
    
            logger.info(`Total a pagar: ${total}`);
            logger.info(`Cantidades por unidad: ${JSON.stringify(cantidadesPorUnidad)}`);
     */
            await cartService.update(cart._id, { products: productosSinStock });
    
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
            logger.info(`Datos de compra: ${JSON.stringify(compraFinal)}`);
    
            let ticket = await ticketService.create(compraFinal);
            logger.info(`Ticket creado: ${JSON.stringify(ticket)}`);
    
            res.setHeader("Content-Type", "application/json");
            return res.status(201).json({
              ticket,
              message: productosSinStock.length > 0
                  ? "La compra se completó con los productos en stock disponibles. Los productos sin stock fueron eliminados del carrito."
                  : "Compra completada con éxito."
          }  
            );
        } catch (error) {
            logger.error(`Error procesando compra: ${error.message}`);
            res.setHeader("Content-Type", "application/json");
            return res.status(500).json("Error inesperado en el servidor al procesar la compra");
        }
    }
}