import 'dotenv/config';

function clean(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
}

const rawUri = clean(process.env.MONGODB_URI);
const validUri = (rawUri.startsWith('mongodb://') || rawUri.startsWith('mongodb+srv://')) ? rawUri : '';

let jwtSecret = clean(process.env.JWT_SECRET) || 'development-only-secret-change-before-production-32-chars';
if (jwtSecret.length < 32) {
  jwtSecret = jwtSecret.padEnd(32, '_');
}

export const env = {
  NODE_ENV: (clean(process.env.NODE_ENV) || 'development') as 'development' | 'test' | 'production',
  PORT: Number(clean(process.env.PORT)) || 5000,
  MONGODB_URI: validUri,
  CLIENT_URL: clean(process.env.CLIENT_URL) || 'http://localhost:5173',
  JWT_SECRET: jwtSecret,
  COOKIE_SECURE: clean(process.env.COOKIE_SECURE) === 'true',
  ADMIN_NAME: clean(process.env.ADMIN_NAME) || 'Choyon Dhor',
  ADMIN_EMAIL: clean(process.env.ADMIN_EMAIL) || 'admin@example.com',
  ADMIN_PASSWORD: clean(process.env.ADMIN_PASSWORD) || 'ChangeMe123!'
};
