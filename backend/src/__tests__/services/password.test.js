import { passwordUtils } from '../../utils/password.js';

describe('Password Utils', () => {
  const testPassword = 'SecurePassword123';

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const hash = await passwordUtils.hashPassword(testPassword);
      expect(hash).toBeDefined();
      expect(hash).not.toBe(testPassword);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should throw error for empty password', async () => {
      await expect(passwordUtils.hashPassword('')).rejects.toThrow();
    });

    it('should throw error for non-string password', async () => {
      await expect(passwordUtils.hashPassword(null)).rejects.toThrow();
      await expect(passwordUtils.hashPassword(123)).rejects.toThrow();
    });

    it('should produce different hashes for same password', async () => {
      const hash1 = await passwordUtils.hashPassword(testPassword);
      const hash2 = await passwordUtils.hashPassword(testPassword);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    it('should return true for matching password', async () => {
      const hash = await passwordUtils.hashPassword(testPassword);
      const isMatch = await passwordUtils.comparePassword(testPassword, hash);
      expect(isMatch).toBe(true);
    });

    it('should return false for non-matching password', async () => {
      const hash = await passwordUtils.hashPassword(testPassword);
      const isMatch = await passwordUtils.comparePassword('WrongPassword', hash);
      expect(isMatch).toBe(false);
    });

    it('should return false for missing inputs', async () => {
      const result1 = await passwordUtils.comparePassword(null, null);
      const result2 = await passwordUtils.comparePassword('password', null);
      expect(result1).toBe(false);
      expect(result2).toBe(false);
    });
  });
});
