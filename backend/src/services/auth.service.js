import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { env } from '../config/env.js';
import { passwordUtils } from '../utils/password.js';
import { HttpError } from '../utils/http-error.js';
import { logger } from '../utils/logger.js';

export const authService = {
  /**
   * Sign a JWT token
   * @param {string} userId - User ID
   * @param {string} email - User email
   * @param {string} companyId - Company ID
   * @param {string} role - User role
   * @returns {string} JWT token
   */
  signToken(userId, email, companyId, role) {
    const payload = {
      sub: userId,
      id: userId,
      email,
      companyId,
      role,
    };

    const options = {
      expiresIn: '24h',
    };

    if (env.jwtAudience) options.audience = env.jwtAudience;
    if (env.jwtIssuer) options.issuer = env.jwtIssuer;

    return jwt.sign(payload, env.jwtSecret, options);
  },

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @param {string} companyId - Company ID
   * @param {string} role - User role (default: 'employee')
   * @returns {Object} User object and JWT token
   */
  async register(email, password, companyId, role = 'employee') {
    // Validate inputs
    if (!email || !password || !companyId) {
      throw new HttpError(400, 'Email, password, and companyId are required');
    }

    if (password.length < 8) {
      throw new HttpError(400, 'Password must be at least 8 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logger.warn({ email }, 'User registration attempt with existing email');
      throw new HttpError(409, 'Email already registered');
    }

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpError(404, 'Company not found');
    }

    // Hash password
    const hashedPassword = await passwordUtils.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        companyId,
        role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
      },
    });

    const token = this.signToken(user.id, user.email, user.companyId, user.role);

    logger.info({ userId: user.id, email: user.email }, 'User registered successfully');

    return {
      user,
      token,
    };
  },

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - Plain text password
   * @returns {Object} User object and JWT token
   */
  async login(email, password) {
    if (!email || !password) {
      throw new HttpError(400, 'Email and password are required');
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        companyId: true,
        password: true,
      },
    });

    if (!user) {
      logger.warn({ email }, 'Login attempt with non-existent email');
      throw new HttpError(401, 'Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await passwordUtils.comparePassword(password, user.password);

    if (!isPasswordValid) {
      logger.warn({ userId: user.id, email }, 'Login attempt with invalid password');
      throw new HttpError(401, 'Invalid email or password');
    }

    // Generate token
    const { password: _, ...userWithoutPassword } = user;
    const token = this.signToken(user.id, user.email, user.companyId, user.role);

    logger.info({ userId: user.id, email: user.email }, 'User logged in successfully');

    return {
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) {
      throw new HttpError(400, 'Current and new passwords are required');
    }

    if (newPassword.length < 8) {
      throw new HttpError(400, 'New password must be at least 8 characters long');
    }

    if (currentPassword === newPassword) {
      throw new HttpError(400, 'New password must be different from current password');
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    // Verify current password
    const isPasswordValid = await passwordUtils.comparePassword(currentPassword, user.password);

    if (!isPasswordValid) {
      logger.warn({ userId }, 'Password change attempt with invalid current password');
      throw new HttpError(401, 'Current password is invalid');
    }

    // Hash new password
    const hashedPassword = await passwordUtils.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info({ userId, email: user.email }, 'Password changed successfully');
  },
};
