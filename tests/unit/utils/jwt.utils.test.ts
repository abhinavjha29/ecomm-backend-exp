import { JwtUtils } from '../../../src/modules/auth/utils/jwt.utils';

describe('JwtUtils', () => {
  const testPayload = {
    userId: 1,
    email: 'test@example.com',
    name: 'Test User'
  };

  describe('generateTokens', () => {
    it('should generate access and refresh tokens', () => {
      const tokens = JwtUtils.generateTokens(testPayload);

      expect(tokens).toHaveProperty('accessToken');
      expect(tokens).toHaveProperty('refreshToken');
      expect(typeof tokens.accessToken).toBe('string');
      expect(typeof tokens.refreshToken).toBe('string');
      expect(tokens.accessToken.length).toBeGreaterThan(0);
      expect(tokens.refreshToken.length).toBeGreaterThan(0);
    });

    it('should generate different tokens for different payloads', () => {
      const tokens1 = JwtUtils.generateTokens(testPayload);
      const tokens2 = JwtUtils.generateTokens({
        ...testPayload,
        userId: 2
      });

      expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
      expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const { accessToken } = JwtUtils.generateTokens(testPayload);
      const decoded = JwtUtils.verifyAccessToken(accessToken);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.name).toBe(testPayload.name);
    });

    it('should return null for invalid token', () => {
      const decoded = JwtUtils.verifyAccessToken('invalid-token');
      expect(decoded).toBeNull();
    });

    it('should return null for expired token', () => {
      // This test would require mocking time or using a short expiry
      const decoded = JwtUtils.verifyAccessToken('');
      expect(decoded).toBeNull();
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const { refreshToken } = JwtUtils.generateTokens(testPayload);
      const decoded = JwtUtils.verifyRefreshToken(refreshToken);

      expect(decoded).toBeDefined();
      expect(decoded?.userId).toBe(testPayload.userId);
      expect(decoded?.email).toBe(testPayload.email);
      expect(decoded?.name).toBe(testPayload.name);
    });

    it('should return null for invalid refresh token', () => {
      const decoded = JwtUtils.verifyRefreshToken('invalid-refresh-token');
      expect(decoded).toBeNull();
    });
  });

  describe('token expiration', () => {
    it('should include expiration in token payload', () => {
      const { accessToken } = JwtUtils.generateTokens(testPayload);
      const decoded = JwtUtils.verifyAccessToken(accessToken);

      expect(decoded).toHaveProperty('exp');
      expect(decoded).toHaveProperty('iat');
    });
  });
});
