import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export const passwordUtils = {
  /**
   * Hash a password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    if (!password || typeof password !== 'string') {
      throw new Error('Password must be a non-empty string');
    }
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Compare a plain text password with a hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password
   * @returns {Promise<boolean>} True if passwords match
   */
  async comparePassword(password, hash) {
    if (!password || !hash) {
      return false;
    }
    try {
      return await bcrypt.compare(password, hash);
    } catch {
      return false;
    }
  },
};
