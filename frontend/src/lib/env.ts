import { z } from 'zod';

/**
 * Environment validation schema for Next.js
 * Validates environment variables at build time
 */
const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),

  // Optional: Analytics, Monitoring, etc.
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * This runs at build time and startup
 */
function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error('Environment validation failed');
  }
}

export const env = validateEnv();

/**
 * Validate environment on client side
 * Use this in your app initialization
 */
export function validateClientEnv(): boolean {
  const requiredVars = ['NEXT_PUBLIC_API_URL'];
  const missing = requiredVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
    return false;
  }

  return true;
}
