import { PasswordUtils } from '../../../src/modules/auth/utils/password.utils';

describe('PasswordUtils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'Test@1234';
      const hashedPassword = await PasswordUtils.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'Test@1234';
      const hash1 = await PasswordUtils.hashPassword(password);
      const hash2 = await PasswordUtils.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty password', async () => {
      // bcrypt actually allows empty passwords, so we just verify it hashes
      const hashedPassword = await PasswordUtils.hashPassword('');
      expect(hashedPassword).toBeDefined();
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const password = 'Test@1234';
      const hashedPassword = await PasswordUtils.hashPassword(password);
      const result = await PasswordUtils.comparePassword(
        password,
        hashedPassword
      );

      expect(result).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const password = 'Test@1234';
      const wrongPassword = 'Wrong@1234';
      const hashedPassword = await PasswordUtils.hashPassword(password);
      const result = await PasswordUtils.comparePassword(
        wrongPassword,
        hashedPassword
      );

      expect(result).toBe(false);
    });

    it('should handle empty strings', async () => {
      const hashedPassword = await PasswordUtils.hashPassword('Test@1234');
      const result = await PasswordUtils.comparePassword('', hashedPassword);

      expect(result).toBe(false);
    });
  });
});
