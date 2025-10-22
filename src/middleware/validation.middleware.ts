import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { HTTP_STATUS, RESPONSE_MESSAGES } from '../utils/contants';

/**
 * Interface for validation schema
 * Allows validation of body, params, and query separately
 */
interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

/**
 * Validation options for Joi
 */
const validationOptions: Joi.ValidationOptions = {
  abortEarly: false, // Return all errors, not just the first one
  allowUnknown: true, // Allow unknown keys that will be stripped
  stripUnknown: true // Remove unknown keys from the validated data
};

/**
 * Middleware factory function to validate request data
 * @param schema - Object containing Joi schemas for body, params, and/or query
 * @returns Express middleware function
 *
 * @example
 * // Validate only body
 * router.post('/signup', validate({ body: signupSchema }), controller.signup);
 *
 * @example
 * // Validate body and params
 * router.put('/user/:id', validate({
 *   params: Joi.object({ id: Joi.string().uuid().required() }),
 *   body: updateUserSchema
 * }), controller.updateUser);
 */
export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const errors: { [key: string]: string[] } = {};

    // Validate body
    if (schema.body) {
      const { error, value } = schema.body.validate(
        req.body,
        validationOptions
      );
      if (error) {
        errors['body'] = error.details.map((detail) => detail.message);
      } else {
        req.body = value; // Replace with validated and sanitized data
      }
    }

    // Validate params
    if (schema.params) {
      const { error, value } = schema.params.validate(
        req.params,
        validationOptions
      );
      if (error) {
        errors['params'] = error.details.map((detail) => detail.message);
      } else {
        req.params = value;
      }
    }

    // Validate query
    if (schema.query) {
      const { error, value } = schema.query.validate(
        req.query,
        validationOptions
      );
      if (error) {
        errors['query'] = error.details.map((detail) => detail.message);
      } else {
        req.query = value;
      }
    }

    // If there are any validation errors, return error response
    if (Object.keys(errors).length > 0) {
      return res.error(
        RESPONSE_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.BAD_REQUEST,
        errors,
        null
      );
    }

    next();
  };
};
