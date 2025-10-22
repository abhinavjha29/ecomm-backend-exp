import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validation.middleware';
import { loginSchema, signupSchema } from '../../utils/validator.utils';

export const authRouter = Router();

const authController = new AuthController();
authRouter.post(
  '/signup',
  validate({ body: signupSchema }),
  authController.signup
);
authRouter.post(
  '/login',
  validate({ body: loginSchema }),
  authController.userLogin
);
