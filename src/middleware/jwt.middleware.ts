import { Request, Response, NextFunction } from 'express';

import { RESPONSE_MESSAGES, HTTP_STATUS } from '../utils/contants';
import { JwtUtils } from '../modules/auth/utils/jwt.utils';

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: number;
      email: string;
      name: string;
    };
  }
}

/**
 * Middleware to verify JWT token and authenticate requests
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.error(
        RESPONSE_MESSAGES.TOKEN_REQUIRED,
        HTTP_STATUS.UNAUTHORIZED,
        'No token provided',
        null
      );
    }

    // Verify token
    const decoded = JwtUtils.verifyAccessToken(token);

    if (!decoded) {
      return res.error(
        RESPONSE_MESSAGES.INVALID_TOKEN,
        HTTP_STATUS.UNAUTHORIZED,
        'Invalid or expired token',
        null
      );
    }

    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name
    };
    next();
  } catch (error) {
    return res.error(
      RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      error,
      null
    );
  }
};
