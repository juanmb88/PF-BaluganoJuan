import {Router} from "express"
import {ProductController} from "../controllers/ProductController.js";
import { authToken } from "../middleware/auth.js";

export const router =Router();

/// OBTENER TODOS LOS PRODUC.
router.get("/", ProductController.getProduct);

/// OBTENER POR ID
router.get("/:pid", ProductController.getProductById);

/// UPDATE POR ID
router.put("/:pid", ProductController.updateProduct);

/// DELETE POR ID
router.delete("/:pid", ProductController.deleteById);

/// AGREGAR PRODUCTO
router.post("/", authToken, ProductController.addProduct);