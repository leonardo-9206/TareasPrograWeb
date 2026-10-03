import { Router } from 'express';
import productsRoutes from './products.routes.ts';

const router = Router();

//agrupamos las rutas bajo /products
router.use('/products', productsRoutes);

export default router;