import Joi from 'joi';

/**
 * This file contains example validation schemas for common use cases
 * Use these as templates for creating your own validation schemas
 */

// ============================================
// Example 1: Validating only request body
// ============================================
export const createProductSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().optional().max(500),
  price: Joi.number().positive().required(),
  category: Joi.string().valid('electronics', 'clothing', 'food').required(),
  inStock: Joi.boolean().default(true)
});

// Usage in route:
// router.post('/products', validate({ body: createProductSchema }), controller.createProduct);

// ============================================
// Example 2: Validating URL params
// ============================================
export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required().messages({
    'string.guid': 'Invalid ID format. Must be a valid UUID'
  })
});

// Usage in route:
// router.get('/products/:id', validate({ params: idParamSchema }), controller.getProduct);

// ============================================
// Example 3: Validating query parameters
// ============================================
export const paginationQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'name', 'price').default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  search: Joi.string().optional().max(100)
});

// Usage in route:
// router.get('/products', validate({ query: paginationQuerySchema }), controller.getProducts);

// ============================================
// Example 4: Validating body, params, and query together
// ============================================
export const updateProductValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required()
  }),
  body: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    price: Joi.number().positive().optional(),
    inStock: Joi.boolean().optional()
  }),
  query: Joi.object({
    notifyUsers: Joi.boolean().default(false)
  })
};

// Usage in route:
// router.put('/products/:id', validate(updateProductValidation), controller.updateProduct);

// ============================================
// Example 5: Email validation
// ============================================
export const emailSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required()
});

// ============================================
// Example 6: Password validation with confirmation
// ============================================
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match'
    })
});
