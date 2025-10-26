import { Router } from 'express';
import { ProductController } from './product.controller';

export const productRouter = Router();

const productController = new ProductController();
productRouter.get('/all', productController.getProducts);
