import { Router } from "express";
import { cartController } from "../controllers/cartController.js";
import  { authToken } from "../middleware/auth.js";

export const router = Router();

router.get("/", cartController.getAll);
router.get("/:cid", cartController.getById);
router.post("/", cartController.createNewCart);
router.post('/:cid/products/:pid',authToken,  cartController.addProductToCart )
router.delete("/:cid/products/:pid", cartController.deleteProductByCart );
router.delete("/:cid", cartController.deleteCartById);
router.put("/:cId/products/:pId", cartController.updateProduct);
router.post("/:cid/purchase", authToken, cartController.purchase);