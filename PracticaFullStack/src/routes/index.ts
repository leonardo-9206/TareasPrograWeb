//central telefonica, importamos el router de express y las rutas de products
import {Router} from "express";
import {UserController} from "../controllers/user.controller.ts";
import productsRoutes from "./products.routes.ts";
import userRoutes from "./user.routes.ts";

const router = Router();
const userController = new UserController();
//agrupamos todas las rutas de productos bajo /products
router.use("/v1/products", productsRoutes);
router.use("/v1/users", userRoutes);
router.get("/:id", (req,res) => userController.getUserById(req,res));
export default router;

//ojo que tambien pudieramos despues definir rutas para /users y decirle que use las rutas de usersRoutes
//por eso usa esa sintaxis