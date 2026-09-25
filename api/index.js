import { app } from '../apps/server/dist/app.js';
import { connectDatabase } from '../apps/server/dist/config/db.js';
import { ensureInitialData } from '../apps/server/dist/data/seed.js';

let readyPromise = null;

async function bootstrap() {
  await connectDatabase();
  await ensureInitialData();
}

export default async function handler(req, res) {
  if (!readyPromise) {
    readyPromise = bootstrap().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }
  await readyPromise;
  return app(req, res);
}
