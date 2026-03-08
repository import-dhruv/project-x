import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import './config/zod.js';

import { apiRouter } from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware.js';
import { xssClean, mongoSanitizer } from './middlewares/sanitize.middleware.js';
import { createRequestLogger, logger } from './utils/logger.js';
import { specs } from './config/swagger.js';
import { prisma } from './config/prisma.js';
import { env } from './config/env.js';

export const app = express();

// Security Middleware
app.use(helmet());

// CORS Configuration
const allowedOrigins = env.allowedOrigins;
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Parsers
app.use(express.json({ limit: '2mb' }));

// Sanitization
app.use(mongoSanitizer);
app.use(xssClean);

// Logging
app.use(createRequestLogger());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  swaggerOptions: {
    persistAuthorization: true,
    displayOperationId: true,
  },
  customCss: `
    .topbar { display: none; }
    .swagger-ui .topbar { display: block; }
  `,
  customSiteTitle: 'Employee Intelligence API Docs',
}));

// Rate Limiting - Global
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', globalLimiter);

// Rate Limiting - Sensitive endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login/register attempts. Please try again later.' },
  skip: (req) => {
    // Skip rate limiting for non-sensitive endpoints
    return !req.path.includes('/auth/login') && !req.path.includes('/auth/register');
  },
});
app.use('/api', authLimiter);

// Rate Limiting - Compute-heavy endpoints
const heavyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded for this resource. Try again in a minute.' },
});
app.use('/api/docs', heavyLimiter);
app.use('/api/pay-fairness', heavyLimiter);
app.use('/api/risk', heavyLimiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, service: 'employee-intelligence-backend', db: 'connected' });
  } catch (error) {
    logger.error(error, 'Health check database connection failed');
    res.status(503).json({ ok: false, service: 'employee-intelligence-backend', db: 'disconnected' });
  }
});

// API Routes
app.use('/api', apiRouter);

// Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);
