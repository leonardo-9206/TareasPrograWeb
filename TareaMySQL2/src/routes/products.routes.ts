import { Router } from 'express';
import { ProductController } from '../controllers/products.controller.ts';

const productController = new ProductController();
const router = Router();

//aqui conectamos las rutas con los verbos HTTP
router.get('/getAll', (req, res) => productController.getAll(req, res));
router.get('/getById/:id', (req, res) => productController.getById(req, res));
router.post('/create', (req, res) => productController.create(req, res));
router.put('/update/:id', (req, res) => productController.update(req, res));
router.delete('/delete/:id', (req, res) => productController.deleteProduct(req, res));
router.patch('/change-price/:id', (req, res) => productController.changePrice(req, res));

export default router;