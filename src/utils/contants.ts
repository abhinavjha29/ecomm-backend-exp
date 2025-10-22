export const API: string = 'api';

// HTTP Status Codes
export const HTTP_STATUS = {
  // Success Codes (2xx)
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Client Error Codes (4xx)
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Error Codes (5xx)
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
} as const;

// Common Response Messages
export const RESPONSE_MESSAGES = {
  // Success Messages
  SUCCESS: 'Operation completed successfully',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Data fetched successfully',

  // Authentication & Authorization
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  UNAUTHORIZED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  ACCESS_DENIED: 'Access denied',
  FORBIDDEN: "You don't have permission to access this resource",

  // Validation Errors
  VALIDATION_ERROR: 'Validation error',
  INVALID_INPUT: 'Invalid input data',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  INVALID_EMAIL: 'Invalid Email',
  INVALID_PASSWORD: 'Invalid Password',
  PASSWORD_MISMATCH: 'Passwords do not match',
  TOKEN_REFRESH_SUCCESS: 'Token refreshed successfully',
  INVALID_TOKEN: 'Invalid or expired token',
  TOKEN_REQUIRED: 'Token is required',

  // Resource Errors
  NOT_FOUND: 'Resource not found',
  ALREADY_EXISTS: 'Resource already exists',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  USER_NOT_FOUND: 'User not found',
  PRODUCT_NOT_FOUND: 'Product not found',

  // Server Errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  BAD_GATEWAY: 'Bad gateway',

  // Rate Limiting
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',

  // Database Errors
  DATABASE_ERROR: 'Database operation failed',
  DUPLICATE_ENTRY: 'Duplicate entry',

  // File Upload
  FILE_UPLOAD_SUCCESS: 'File uploaded successfully',
  FILE_UPLOAD_FAILED: 'File upload failed',
  INVALID_FILE_TYPE: 'Invalid file type',
  FILE_TOO_LARGE: 'File size exceeds limit'
} as const;
