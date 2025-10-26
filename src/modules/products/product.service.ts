import Database from '../../config/database';

const prisma = Database.getInstance();

export interface PaginationParams {
  page: number;
  limit: number;
}
export interface PaginatedResponse<T> {
  productData: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export class ProductService {
  async getAllProducts(
    params: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      prisma.products.count()
    ]);
    return {
      productData: products,
      pagination: { total, page, limit }
    };
  }
}
// Inefficient for now will improve later with caching and indexing
