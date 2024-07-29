import { Router } from "express";
import { ProductController } from "../controllers/ProductController.js";
import { authToken } from "../middleware/auth.js";

export const router = Router();


/// OBTENER TODOS LOS PRODUCTOS
router.get("/", ProductController.getProduct);
// Inserción de 100 productos con faker
router.get("/mockingProducts", ProductController.mockProducts);

/// AGREGAR PRODUCTO
router.post("/",authToken, ProductController.addProduct);
/// OBTENER POR ID
router.get("/:pid", ProductController.getProductById);

/// UPDATE POR ID
router.put("/:pid",authToken, ProductController.updateProduct);

/// DELETE POR ID
router.delete("/:pid",authToken, ProductController.deleteById);

