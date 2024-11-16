import { Router } from "express";
import { productController } from "../controllers/productController.js";
import { authToken } from "../middleware/auth.js";

export const router = Router();


router.get("/", productController.getProduct);
router.get("/mockingProducts", productController.mockProducts);
router.post("/",authToken, productController.addProduct);
router.get("/:pid", productController.getProductById);
router.put("/:pid",authToken, productController.updateProduct);
router.delete("/:pid",authToken, productController.deleteById);

