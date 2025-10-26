import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../../utils/contants';

export class ProductController {
  private productService: ProductService;
  constructor() {
    this.productService = new ProductService();
  }
  getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
      const limit = parseInt(req.query?.['limit'] as string, 10) || 10;
      const page = parseInt(req.query?.['page'] as string, 10) || 1;
      const products = await this.productService.getAllProducts({
        limit: limit as number,
        page: page as number
      });
      return res.success(products, RESPONSE_MESSAGES.FETCHED, HTTP_STATUS.OK);
    } catch (error) {
      console.log('error', error);
      return res.error(
        RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        error,
        null
      );
    }
  };
}
