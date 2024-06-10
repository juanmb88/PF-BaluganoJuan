import { Router } from "express";
import { CartController } from "../controllers/cartController.js";

export const router = Router();

//TRAER TODOS LOS CARRITOS
router.get("/", CartController.getAll);

//TRAER CARRITO POR ID 
router.get("/:cid", CartController.getById);

//CREAR UN NUEVO CARRITO
router.post("/", CartController.createNewCart);

//AGREGAR PRODUCTOS AL CARRITO
router.post('/:cid/products/:pid',  CartController.addProductToCart )

//ELIMINAR PRODUCTO DEL CARRITO POR UNIDAD (QUANTITY)
router.delete("/:cid/products/:pid", CartController.deleteProductByCart );

//ELIMINAR CARRITO POR ID
router.delete("/:cid", CartController.deleteCartById);

//Modificar un producto desde el carrito
router.put("/:cId/products/:pId", CartController.updateProduct);