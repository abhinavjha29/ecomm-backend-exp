import { Request, Response, NextFunction } from 'express';
import { ResponseFormatter } from '../utils/api-response';

// Extend Express Response type to include custom methods
declare module 'express-serve-static-core' {
  interface Response {
    success<T>(data: T, message?: string, statusCode?: number): Response;
    error(
      message?: string,
      statusCode?: number,
      error?: any,
      data?: any
    ): Response;
  }
}

/**
 * Response formatter middleware
 * Adds custom success() and error() methods to Express Response object
 * This ensures all API responses follow a consistent format
 */
export const responseFormatterMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  // Add success method to response object
  res.success = function <T>(
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response = ResponseFormatter.success(data, message, statusCode);
    return this.status(statusCode).json(response);
  };

  // Add error method to response object
  res.error = function (
    message: string = 'An error occurred',
    statusCode: number = 500,
    error?: any,
    data: any = null
  ): Response {
    const response = ResponseFormatter.error(message, statusCode, error, data);
    return this.status(statusCode).json(response);
  };

  next();
};
