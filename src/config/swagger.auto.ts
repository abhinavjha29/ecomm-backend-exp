import swaggerAutogen from 'swagger-autogen';
import j2s from 'joi-to-swagger';
import { loginSchema, signupSchema } from '../utils/validator.utils';
import { API } from '../utils/contants';
import { Versions } from '../utils/common.type';

const outputFile = './src/config/swagger-output.json';
const endpointsFiles = ['./src/app.ts'];

// Convert Joi schemas to Swagger schemas automatically
const { swagger: signupSwagger } = j2s(signupSchema);
const { swagger: loginSwagger } = j2s(loginSchema);

const doc = {
  info: {
    title: 'E-Commerce API Documentation',
    version: '1.0.0',
    description:
      'API documentation for the E-Commerce backend application (Auto-generated)',
    contact: {
      name: 'Abhinav JHA',
      email: 'support@ecommerce.com'
    },
    license: {
      name: 'ISC'
    }
  },
  host: `localhost:5080`,
  basePath: `/${API}/${Versions.V1}`,
  schemes: ['http', 'https'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication endpoints for signup and login'
    },
    {
      name: 'Health',
      description: 'Health check endpoints'
    }
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description:
        "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
    }
  },
  definitions: {
    SignupRequest: signupSwagger,
    LoginRequest: loginSwagger,
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation successful' },
        data: { type: 'object' }
      }
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Error message' },
        error: { type: 'string' }
      }
    }
  }
};

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc).then(
  () => {
    console.log('✅ Swagger documentation generated successfully!');
  }
);
