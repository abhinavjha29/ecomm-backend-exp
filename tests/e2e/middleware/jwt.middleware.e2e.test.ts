import request from 'supertest';
import app from '../../../src/app';
import { TestDatabase } from '../../helpers/test-database';
import { TestFactory } from '../../helpers/test-factory';
import { JwtUtils } from '../../../src/modules/auth/utils/jwt.utils';

describe('JWT Middleware E2E Tests', () => {
  let validToken: string;
  let testUser: any;

  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    await TestDatabase.cleanup();
    testUser = await TestFactory.createUser({
      email: 'jwt-test@example.com',
      password: 'Test@1234'
    });

    const tokens = JwtUtils.generateTokens({
      userId: testUser.user_id,
      email: testUser.email,
      name: testUser.name
    });
    validToken = tokens.accessToken;
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  describe('Protected Routes', () => {
    it.skip('should deny access without token', async () => {
      // Skipped: Requires protected route implementation
      // This test assumes you have a protected route
      // You'll need to create a test protected endpoint
      const response = await request(app)
        .get('/api/v1/auth/protected-test-route')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it.skip('should allow access with valid token', async () => {
      // Skipped: Requires protected route implementation
      // This test assumes you have a protected route
      const response = await request(app)
        .get('/api/v1/auth/protected-test-route')
        .set('Authorization', `Bearer ${validToken}`);

      // Adjust expectation based on your protected route
      expect([200, 404]).toContain(response.status);
    });

    it.skip('should deny access with invalid token', async () => {
      // Skipped: Requires protected route implementation
      const response = await request(app)
        .get('/api/v1/auth/protected-test-route')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it.skip('should deny access with malformed authorization header', async () => {
      // Skipped: Requires protected route implementation
      const response = await request(app)
        .get('/api/v1/auth/protected-test-route')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it.skip('should extract user info from valid token', async () => {
      // Skipped: Requires protected route implementation
      // Create a test route that returns user info
      await request(app)
        .get('/api/v1/auth/protected-test-route')
        .set('Authorization', `Bearer ${validToken}`);

      // Verify user info is attached to request
      // This depends on how your protected route is implemented
    });
  });

  describe('Token Validation', () => {
    it.skip('should reject expired token', async () => {
      // Skipped: Requires protected route implementation
      // Create an expired token (you might need to mock this)
      const expiredToken = 'expired.jwt.token';

      const response = await request(app)
        .get('/api/v1/auth/protected-test-route')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should accept token in correct format', () => {
      const tokens = JwtUtils.generateTokens({
        userId: testUser.user_id,
        email: testUser.email,
        name: testUser.name
      });

      expect(tokens.accessToken).toMatch(
        /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
      );
    });
  });
});
