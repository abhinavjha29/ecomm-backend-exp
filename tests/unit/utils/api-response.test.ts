import { ResponseFormatter } from '../../../src/utils/api-response';

describe('ResponseFormatter', () => {
  describe('success', () => {
    it('should format a successful response with default values', () => {
      const data = { id: 1, name: 'Test' };
      const response = ResponseFormatter.success(data);

      expect(response).toEqual({
        success: true,
        message: 'Success',
        data: data,
        statusCode: 200
      });
    });

    it('should format a successful response with custom message', () => {
      const data = { id: 1 };
      const message = 'User created successfully';
      const response = ResponseFormatter.success(data, message);

      expect(response.success).toBe(true);
      expect(response.message).toBe(message);
      expect(response.data).toEqual(data);
    });

    it('should format a successful response with custom status code', () => {
      const data = { id: 1 };
      const statusCode = 201;
      const response = ResponseFormatter.success(data, 'Created', statusCode);

      expect(response.statusCode).toBe(statusCode);
    });

    it('should handle null data', () => {
      const response = ResponseFormatter.success(null);

      expect(response.success).toBe(true);
      expect(response.data).toBeNull();
    });

    it('should handle array data', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const response = ResponseFormatter.success(data);

      expect(response.data).toEqual(data);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('error', () => {
    it('should format an error response with default values', () => {
      const response = ResponseFormatter.error();

      expect(response).toEqual({
        success: false,
        message: 'An error occurred',
        statusCode: 500,
        data: null
      });
    });

    it('should format an error response with custom message', () => {
      const message = 'User not found';
      const response = ResponseFormatter.error(message);

      expect(response.success).toBe(false);
      expect(response.message).toBe(message);
    });

    it('should format an error response with custom status code', () => {
      const statusCode = 404;
      const response = ResponseFormatter.error('Not found', statusCode);

      expect(response.statusCode).toBe(statusCode);
    });

    it('should include error details', () => {
      const errorDetails = { field: 'email', reason: 'invalid format' };
      const response = ResponseFormatter.error(
        'Validation failed',
        400,
        errorDetails
      );

      expect(response.error).toEqual(errorDetails);
    });

    it('should include additional data', () => {
      const additionalData = { attempts: 3 };
      const response = ResponseFormatter.error(
        'Too many attempts',
        429,
        null,
        additionalData
      );

      expect(response.data).toEqual(additionalData);
    });

    it('should handle Error objects', () => {
      const error = new Error('Something went wrong');
      const response = ResponseFormatter.error('Failed', 500, error);

      expect(response.error).toBe(error);
    });
  });
});
