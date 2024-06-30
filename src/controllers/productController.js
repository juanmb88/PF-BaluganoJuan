import { productService } from "../services/ProductService.js";
import { isValidObjectId, CustomError} from "../utils.js";
import { TIPOS_ERROR } from "../utils/EnumeraErrores.js";
import { argumentosRepetidosProduct, productoExistente, tituloObligatorioProduct} from "../utils/erroresProducts.js";
export class ProductController {

    static getProduct = async (req, res) => {
        const products = await productService.getProducts();
        res.json({ products });
    }

    static getProductById = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const productfind = await productService.getProductById(pid);
        res.json({ status: "success", productfind });
    };

    static updateProduct = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const updatedproduct = await productService.updateProduct(pid, req.body);
        res.json({ status: "success", updatedproduct });
    };

    static deleteById = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            return res.status(400).json({ error: "Invalid product ID" });
        }
        const deleteproduct = await productService.deleteProductById(pid);
        res.json({ status: "success", deleteproduct });
    };

    static addProduct = async (req, res) => {
        let { title, ...otrasPropiedades } = req.body;

        if (!title) {
            CustomError.createError("Argumento nombre faltante",
                tituloObligatorioProduct(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }

        let existe;

        try {
            existe = await productService.getOneBy({ title });
        } catch (error) {
            console.log(error);
            res.setHeader('Content-Type', 'application/json');
            return res.status(500).json({
                error: `Unexpected server error - Try later, or contact your administratoooooooooor`,
                detalle: `${error.message}`
            });
        }

        if (existe) {
            CustomError.createError("Error", productoExistente(req.body), "Ya hay un producto igual", TIPOS_ERROR.CONFLICT)
        }

        try {
            let newProduct = await productService.create({ title, ...otrasPropiedades });
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ newProduct });
        } catch (error) {
            console.log(error);  
            CustomError.createError("Se repite info", argumentosRepetidosProduct(req.body), TIPOS_ERROR.ARGUMENTOS_INVALIDOS)
        }
    };

    static mockProducts = async (req, res) => {
        console.log('Entering getMockProducts');
        const mockProducts = [];
        for (let i = 0; i < 100; i++) {
            mockProducts.push({
                title: `Product ${i}`,
                description: `Description for product ${i}`,
                price: Math.floor(Math.random() * 1000),
                stock: Math.floor(Math.random() * 100),
                thumbnail: `https://via.placeholder.com/150`,
                code: `code${i}`,
                category: `Category ${i}`,
                status: true
            });
        }
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ status: "success", products: mockProducts });
    }
}
