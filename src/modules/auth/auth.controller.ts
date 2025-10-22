import { HTTP_STATUS, RESPONSE_MESSAGES } from '../../utils/contants';
import { UserService } from './auth.service';
import { Request, Response } from 'express';
import { UserLoginData, UserSignupData } from './utils/types.utils';
import { PasswordUtils } from './utils/password.utils';
import { JwtUtils } from './utils/jwt.utils';

export class AuthController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }
  signup = async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password, isAdmin }: UserSignupData = req.body;

      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        return res.error(
          'User already exists',
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.ALREADY_EXISTS,
          null
        );
      }

      const hashedPassword = await PasswordUtils.hashPassword(password);
      const userData: UserSignupData = {
        name,
        email,
        password: hashedPassword,
        isAdmin
      };
      const newUser = await this.userService.createUser(userData);
      return res.success(newUser, RESPONSE_MESSAGES.REGISTER_SUCCESS, 201);
    } catch (error) {
      console.log('error', error);
      return res.error('Signup failed', 500, error, null);
    }
  };

  userLogin = async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password }: UserLoginData = req.body;
      if (!email || !password) {
        return res.error(
          'Email/Password missing',
          HTTP_STATUS.BAD_REQUEST,
          RESPONSE_MESSAGES.MISSING_REQUIRED_FIELDS
        );
      }
      const user = await this.userService.findUserByEmail(email);
      console.log('user', user);
      if (!user) {
        return res.error(
          RESPONSE_MESSAGES.USER_NOT_FOUND,
          HTTP_STATUS.BAD_REQUEST,
          'Email not found',
          null
        );
      }
      if (user) {
        const isPassword: boolean = await PasswordUtils.comparePassword(
          password,
          user?.password
        );
        if (!isPassword) {
          return res.error(
            RESPONSE_MESSAGES.INVALID_PASSWORD,
            HTTP_STATUS.BAD_REQUEST,
            'Wrong passord',
            null
          );
        } else {
          const jwtPayload = {
            name: user.name,
            userId: user.user_id,
            email: user.email
          };
          const jwtToken = JwtUtils.generateTokens(jwtPayload);
          const { accessToken } = jwtToken;
          const responseData = {
            userData: {
              name: user.name,
              email: user.email,
              created_at: user.created_at,
              updated_at: user.updated_at
            },
            accessToken: accessToken
          };
          return res.success(
            responseData,
            RESPONSE_MESSAGES.LOGIN_SUCCESS,
            HTTP_STATUS.OK
          );
        }
      }
    } catch (error) {
      console.error('Login error', error);
      res.error(
        'Unable to login',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        RESPONSE_MESSAGES.INTERNAL_SERVER_ERROR,
        null
      );
    }
  };
}
