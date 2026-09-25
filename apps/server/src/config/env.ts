import 'dotenv/config';
import { z } from 'zod';

const mongoUriSchema = z
  .string()
  .min(1, 'MONGODB_URI is required')
  .refine(
    (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
    'MONGODB_URI must start with mongodb:// or mongodb+srv://'
  );

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: mongoUriSchema,
  CLIENT_URL: z.string().default('http://localhost:5173'),
  JWT_SECRET: z.string().min(32).default('development-only-secret-change-before-production'),
  COOKIE_SECURE: z.string().default('false').transform((value) => value === 'true'),
  ADMIN_NAME: z.string().default('Choyon Dhor'),
  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(8).default('ChangeMe123!')
});

export const env = envSchema.parse(process.env);
