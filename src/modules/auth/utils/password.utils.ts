import bcrypt from 'bcrypt';

export class PasswordUtils {
  private static SALT_ROUNDS = 10;

  /**
   * Hash a plain text password
   * @param password - Plain text password to hash
   * @returns Hashed password
   */
  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error('error hashing password', error);
      throw new Error('error hashing password');
    }
  }
  /**
   * Compare a plain text password with a hashed password
   * @param password - Plain text password
   * @param hashedPassword - Hashed password to compare against
   * @returns True if passwords match, false otherwise
   */
  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
