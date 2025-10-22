import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { responseFormatterMiddleware } from '../../../src/middleware/api-response.middleware';

describe('Response Formatter Middleware E2E', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(responseFormatterMiddleware);
  });

  describe('Success Response', () => {
    it('should format success response correctly', async () => {
      app.get('/test-success', (_req: Request, res: Response) => {
        res.success({ id: 1, name: 'Test' }, 'Data retrieved', 200);
      });

      const response = await request(app).get('/test-success').expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Data retrieved',
        data: { id: 1, name: 'Test' },
        statusCode: 200
      });
    });

    it('should use default message for success', async () => {
      app.get('/test-default', (_req: Request, res: Response) => {
        res.success({ test: true });
      });

      const response = await request(app).get('/test-default').expect(200);

      expect(response.body.message).toBe('Success');
      expect(response.body.success).toBe(true);
    });

    it('should handle different status codes', async () => {
      app.post('/test-created', (_req: Request, res: Response) => {
        res.success({ id: 1 }, 'Created', 201);
      });

      const response = await request(app).post('/test-created').expect(201);

      expect(response.body.statusCode).toBe(201);
    });
  });

  describe('Error Response', () => {
    it('should format error response correctly', async () => {
      app.get('/test-error', (_req: Request, res: Response) => {
        res.error('Not found', 404, 'Resource not found', null);
      });

      const response = await request(app).get('/test-error').expect(404);

      expect(response.body).toEqual({
        success: false,
        message: 'Not found',
        statusCode: 404,
        error: 'Resource not found',
        data: null
      });
    });

    it('should use default error message', async () => {
      app.get('/test-default-error', (_req: Request, res: Response) => {
        res.error();
      });

      const response = await request(app)
        .get('/test-default-error')
        .expect(500);

      expect(response.body.message).toBe('An error occurred');
      expect(response.body.success).toBe(false);
    });

    it('should handle validation errors', async () => {
      app.post('/test-validation', (_req: Request, res: Response) => {
        res.error(
          'Validation failed',
          400,
          { field: 'email', message: 'Invalid format' },
          null
        );
      });

      const response = await request(app).post('/test-validation').expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.error).toEqual({
        field: 'email',
        message: 'Invalid format'
      });
    });
  });

  describe('Middleware Integration', () => {
    it('should attach methods to response object', async () => {
      app.get('/test-methods', (_req: Request, res: Response) => {
        expect(typeof res.success).toBe('function');
        expect(typeof res.error).toBe('function');
        res.success({ ok: true });
      });

      await request(app).get('/test-methods').expect(200);
    });

    it('should work with error handling middleware', async () => {
      app.get('/test-throw', () => {
        throw new Error('Test error');
      });

      // Error handler
      app.use(
        (err: Error, _req: Request, res: Response, _next: NextFunction) => {
          res.error('Internal error', 500, err.message, null);
        }
      );

      const response = await request(app).get('/test-throw').expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal error');
    });
  });
});
