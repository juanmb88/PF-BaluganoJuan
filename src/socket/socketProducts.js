import { productService } from "../services/ProductService.js";
import { logger } from "../helper/Logger.js";

const socketProducts = (socketServer) => {
    socketServer.on("connection", async (socket) => {
        try {
            const listOfProducts = await productService.getProducts();
            socketServer.emit('sendProducts', listOfProducts);

            socket.on("addProduct", async (obj) => {
                try {
                    await productService.addProduct(obj);
                    const updatedProducts = await productService.getProducts();
                    socketServer.emit('sendProducts', updatedProducts); 
                    logger.info("Producto agregado correctamente");
                } catch (error) {
                    logger.error("Error al agregar producto", error);
                }
            });

            socket.on("deleteProduct", async (id) => {
                try {
                    logger.info(`Se recibió un evento para eliminar el producto con ID: ${id}`);
                    await productService.deleteProductById(id);
                    const updatedProducts = await productService.getProducts();
                    socketServer.emit('sendProducts', updatedProducts);
                    logger.info(`Producto con ID ${id} eliminado correctamente`);
                } catch (error) {
                    logger.error(`Error al eliminar producto con ID: ${id}`, error);
                }
            });

            socket.on("showProduct", async (id) => {
                try {
                    logger.info(`Se recibió un evento para mostrar el producto con ID: ${id}`);
                    const product = await productService.getProductById(id);
                    socketServer.emit('showProduct', product);
                    logger.info(`Producto mostrado correctamente con ID: ${id}`);
                } catch (error) {
                    logger.error(`Error al mostrar producto con ID: ${id}`, error);
                }
            });

             socket.on("updateProduct", async (data) => {
                try {
                    const { id, updatedProduct } = data;
                    logger.info(`Se recibió un evento para actualizar el producto con ID: ${id}`);
                    await productService.updateProduct(id, updatedProduct);
                    const updatedProducts = await productService.getProducts();
                    socketServer.emit('sendProducts', updatedProducts);
                    logger.info(`Producto con ID ${id} actualizado correctamente`);
                } catch (error) {
                    logger.error(`Error al actualizar producto con ID: ${id}`, error);
                }
            });  
        } catch (error) {
            logger.error("Error en conexión de socket", error);
        }
    });
};

export default socketProducts;
