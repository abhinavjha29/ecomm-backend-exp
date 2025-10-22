import request from 'supertest';
import app from '../../../src/app';
import { TestDatabase } from '../../helpers/test-database';
import { TestFactory } from '../../helpers/test-factory';

describe('Auth E2E Tests', () => {
  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    await TestDatabase.cleanup();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  describe('POST /api/v1/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const signupData = TestFactory.generateSignupData({
        name: 'JohnDoe',
        email: 'john@example.com',
        password: 'Test@1234'
      });

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('email', signupData.email);
      expect(response.body.data).toHaveProperty('name', signupData.name);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 400 for duplicate email', async () => {
      const signupData = TestFactory.generateSignupData({
        email: 'duplicate@example.com'
      });

      // Create first user
      await request(app).post('/api/v1/auth/signup').send(signupData);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    it('should return 400 for invalid email format', async () => {
      const signupData = TestFactory.generateSignupData({
        email: 'invalid-email'
      });

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@example.com'
          // Missing name and password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for weak password', async () => {
      const signupData = TestFactory.generateSignupData({
        password: '123' // Weak password
      });

      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should hash the password before storing', async () => {
      const signupData = TestFactory.generateSignupData({
        password: 'Test@1234'
      });

      await request(app).post('/api/v1/auth/signup').send(signupData);

      const prisma = TestDatabase.getInstance();
      const user = await prisma.users.findUnique({
        where: { email: signupData.email }
      });

      expect(user?.password).toBeDefined();
      expect(user?.password).not.toBe(signupData.password);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const user = await TestFactory.createUser({
        email: 'login@example.com',
        password: 'Test@1234'
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: user.plainPassword
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('userData');
      expect(response.body.data.userData).toHaveProperty('email', user.email);
      expect(response.body.data.userData).not.toHaveProperty('password');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test@1234'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid password', async () => {
      const user = await TestFactory.createUser({
        email: 'wrongpass@example.com',
        password: 'Test@1234'
      });

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: user.email,
          password: 'WrongPassword@123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          password: 'Test@1234'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return valid JWT token on successful login', async () => {
      const user = await TestFactory.createUser({
        email: 'jwt@example.com',
        password: 'Test@1234'
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email: user.email,
        password: user.plainPassword
      });

      const { accessToken } = response.body.data;
      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');
      expect(accessToken.split('.')).toHaveLength(3); // JWT format
    });
  });

  describe('Authentication flow', () => {
    it('should complete full signup and login flow', async () => {
      const signupData = TestFactory.generateSignupData({
        email: 'flow@example.com',
        password: 'Test@1234'
      });

      // Step 1: Signup
      const signupResponse = await request(app)
        .post('/api/v1/auth/signup')
        .send(signupData)
        .expect(201);

      expect(signupResponse.body.success).toBe(true);

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: signupData.email,
          password: signupData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data).toHaveProperty('accessToken');
    });
  });
});
