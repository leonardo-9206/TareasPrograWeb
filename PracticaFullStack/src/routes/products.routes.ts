//importamos la clase ProductController, la instanciamos y exportamos el router ya con las rutas o metodos conectados al final
import {Router} from "express";
import {ProductController} from "../controllers/products.controller.ts";

//instanciamos el controlador y el router de express
const productController = new ProductController();
const router = Router();

//conectamos cada verbo HTPP con su metodo del controlador
router.get("/", (req, res) => productController.getProducts(req,res));
router.post("/", (req,res) => productController.createProduct(req,res));
//le pone que en la raiz mas un ID (/products/2)
router.put("/:id", (req,res) => productController.updateProduct(req,res));

export default router;