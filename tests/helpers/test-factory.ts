import { UserSignupData } from '../../src/modules/auth/utils/types.utils';
import { PasswordUtils } from '../../src/modules/auth/utils/password.utils';
import { TestDatabase } from './test-database';

/**
 * Factory functions for creating test data
 */
export class TestFactory {
  /**
   * Create a test user
   */
  static async createUser(
    overrides: Partial<UserSignupData> = {}
  ): Promise<any> {
    const prisma = TestDatabase.getInstance();
    const defaultPassword = 'Test@1234';

    const userData = {
      name: overrides.name || 'TestUser',
      email: overrides.email || `test${Date.now()}@example.com`,
      password: await PasswordUtils.hashPassword(
        overrides.password || defaultPassword
      ),
      isAdmin: overrides.isAdmin || false
    };

    const user = await prisma.users.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        is_admin: userData.isAdmin
      }
    });

    return { ...user, plainPassword: overrides.password || defaultPassword };
  }

  /**
   * Create multiple test users
   */
  static async createUsers(count: number): Promise<any[]> {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(
        await this.createUser({
          name: `TestUser${i + 1}`,
          email: `testuser${i + 1}_${Date.now()}@example.com`
        })
      );
    }
    return users;
  }

  /**
   * Generate valid signup data
   */
  static generateSignupData(
    overrides: Partial<UserSignupData> = {}
  ): UserSignupData {
    return {
      name: overrides.name || 'TestUser',
      email: overrides.email || `test${Date.now()}@example.com`,
      password: overrides.password || 'Test@1234',
      isAdmin: overrides.isAdmin || false
    };
  }
}
