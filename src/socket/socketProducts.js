import { productService } from "../services/ProductService.js";

 const socketProducts = (socketServer) => {
    socketServer.on("connection", async(socket)=>{
        const listOfProducts = await productService.getProducts();
        
        socketServer.emit('sendProducts',listOfProducts);

        socket.on("addProduct", async(obj)=>{
            await productService.addProduct(obj);
            const listOfProducts = await productService.getProducts();
            socketServer.emit('sendProducts',listOfProducts);
            });

        socket.on("deleteProduct", async(id)=>{
            console.log("Se recibió un evento para eliminar el producto con ID:", id);
            await productService.deleteProductById(id);
            const listOfProducts = await productService.getProducts();
            socketServer.emit('sendProducts',listOfProducts);
            });

        socket.on("showProduct", async(id)=>{
                console.log("Se recibió un evento para mostrar el producto con ID:", id);
                const product = await productService.getProductById(id);
                socketServer.emit('showProduct',product);
                });
 
            socket.on("updateProduct", async(data)=>{
                const {id, updateProduct} = data
                console.log("Se recibió un evento para actualizar el producto con ID:", id);
                await productService.updateProduct(id, updateProduct);
                const listOfProducts = await productService.getProducts();
                socketServer.emit('sendProducts',listOfProducts);
                }); 

             /*     socket.on("updateProduct", async (data) => {
                    const { id, updatedProduct } = data;
                    console.log("Se recibió un evento para actualizar el producto con ID:", id);
                    await ProductModel.updateOne({ id }, updatedProduct);
                    const listOfProducts = await ProductModel.find(); // Suponiendo que obtenga todos los productos actualizados después de la actualización
                    socketServer.emit('sendProducts', listOfProducts);
                });  */
        
    });
};

export default socketProducts;