import { app } from '../apps/server/dist/app.js';
import { connectDatabase } from '../apps/server/dist/config/db.js';
import { ensureInitialData } from '../apps/server/dist/data/seed.js';

let readyPromise = null;

async function bootstrap() {
  await connectDatabase();
  await ensureInitialData();
}

export default async function handler(req, res) {
  try {
    if (!readyPromise) {
      readyPromise = bootstrap().catch((err) => {
        readyPromise = null;
        console.error('Serverless bootstrap error:', err);
        throw err;
      });
    }
    await readyPromise;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Failed to initialize database connection:', message);
    if (req.url && req.url.startsWith('/api/health')) {
      return res.status(200).json({
        status: 'warn',
        message: 'API running but database connection failed: ' + message
      });
    }
  }

  return app(req, res);
}
