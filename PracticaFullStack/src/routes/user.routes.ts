//aqui nomas configuramos el router para que este conectado con el metodo de buscar usuario por id
import { Router } from "express";
import { UserController } from "../controllers/user.controller.ts";

const userController = new UserController();
const router = Router();

// Conectamos la ruta GET /:id con el método getUserById del controlador
router.get('/:id', (req, res) => userController.getUserById(req, res));

export default router;