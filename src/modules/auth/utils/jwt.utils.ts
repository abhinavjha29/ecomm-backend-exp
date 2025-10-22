import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: any;
  email: string;
  name: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

interface DecodedToken extends JwtPayload {
  iat: number;
  exp: number;
}
export class JwtUtils {
  private static JWT_SECRET = process.env['JWT_SECRET'] || 'default-secret';
  private static JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';
  private static JWT_REFRESH_SECRET =
    process.env['JWT_REFRESH_SECRET'] || 'default-refresh-secret';
  private static JWT_REFRESH_EXPIRES_IN =
    process.env['JWT_REFRESH_EXPIRES_IN'] || '30d';

  static generateTokens(payload: JwtPayload): TokenResponse {
    const accessToken = jwt.sign(payload, this.JWT_SECRET as jwt.Secret, {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    });

    const refreshToken = jwt.sign(
      payload,
      this.JWT_REFRESH_SECRET as jwt.Secret,
      {
        expiresIn: this.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn']
      }
    );
    return { accessToken, refreshToken };
  }
  /**
   * Generate only access token
   */
  static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.JWT_SECRET as jwt.Secret, {
      expiresIn: this.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']
    });
  }

  static verifyAccessToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as DecodedToken;
      return decoded;
    } catch (error: any) {
      console.error('error in verifying token', error);
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(
        token,
        this.JWT_REFRESH_SECRET
      ) as DecodedToken;
      return decoded;
    } catch (error) {
      return null;
    }
  }
  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }
}
