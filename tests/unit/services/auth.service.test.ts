import { UserService } from '../../../src/modules/auth/auth.service';
import { TestDatabase } from '../../helpers/test-database';
import { TestFactory } from '../../helpers/test-factory';

describe('UserService Unit Tests', () => {
  let userService: UserService;

  beforeAll(async () => {
    await TestDatabase.initialize();
  });

  beforeEach(async () => {
    await TestDatabase.cleanup();
    userService = new UserService();
  });

  afterAll(async () => {
    await TestDatabase.disconnect();
  });

  describe('findUserByEmail', () => {
    it('should find an existing user by email', async () => {
      const testUser = await TestFactory.createUser({
        email: 'find@example.com'
      });

      const foundUser = await userService.findUserByEmail(testUser.email);

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(testUser.email);
      expect(foundUser?.name).toBe(testUser.name);
    });

    it('should return null for non-existent email', async () => {
      const foundUser = await userService.findUserByEmail(
        'nonexistent@example.com'
      );

      expect(foundUser).toBeNull();
    });

    it('should be case-sensitive for email search', async () => {
      await TestFactory.createUser({
        email: 'test@example.com'
      });

      const foundUser = await userService.findUserByEmail('TEST@EXAMPLE.COM');

      // Depending on your database collation, this might pass or fail
      // Adjust based on your requirements
      expect(foundUser).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'hashedPassword123',
        isAdmin: false
      };

      const createdUser = await userService.createUser(userData);

      expect(createdUser).toBeDefined();
      expect(createdUser.email).toBe(userData.email);
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser).toHaveProperty('user_id');
      expect(createdUser).toHaveProperty('created_at');
      expect(createdUser).toHaveProperty('updated_at');
    });

    it('should not return password in created user object', async () => {
      const userData = {
        name: 'Password Test',
        email: 'password@example.com',
        password: 'hashedPassword123',
        isAdmin: false
      };

      const createdUser = await userService.createUser(userData);

      expect(createdUser).not.toHaveProperty('password');
    });

    it('should create user with admin flag', async () => {
      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'hashedPassword123',
        isAdmin: true
      };

      const createdUser = await userService.createUser(userData);

      expect(createdUser).toBeDefined();

      // Verify in database
      const prisma = TestDatabase.getInstance();
      const dbUser = await prisma.users.findUnique({
        where: { email: userData.email }
      });

      expect(dbUser?.is_admin).toBe(true);
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Duplicate User',
        email: 'duplicate@example.com',
        password: 'hashedPassword123',
        isAdmin: false
      };

      await userService.createUser(userData);

      await expect(userService.createUser(userData)).rejects.toThrow();
    });

    it('should set timestamps on user creation', async () => {
      const userData = {
        name: 'Timestamp Test',
        email: 'timestamp@example.com',
        password: 'hashedPassword123',
        isAdmin: false
      };

      const createdUser = await userService.createUser(userData);

      expect(createdUser.created_at).toBeDefined();
      expect(createdUser.updated_at).toBeDefined();
      expect(createdUser.created_at).toBeInstanceOf(Date);
      expect(createdUser.updated_at).toBeInstanceOf(Date);
    });
  });
});
