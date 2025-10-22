import Joi from 'joi';

/**
 * Validation schema for user signup
 */
export const signupSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(5).required().messages({
    'string.min': 'Password must be at least 5 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  name: Joi.string()
    .min(2)
    .max(100)
    .trim()
    .required()
    .pattern(/^[^\s]+$/)
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.empty': 'Name is required',
      'any.required': 'Name is required',
      'string.pattern.base': 'Name cannot contain spaces'
    })
  // Add more fields as needed based on your User model
});

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});
