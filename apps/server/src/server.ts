import { app } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { env } from './config/env.js';
import { ensureInitialData } from './data/seed.js';

async function start(): Promise<void> {
  await connectDatabase();
  await ensureInitialData();
  const server = app.listen(env.PORT, () => {
    console.log(`CHOYON//NEXUS API running on port ${env.PORT}`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully.`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => void shutdown('SIGTERM'));
  process.on('SIGINT', () => void shutdown('SIGINT'));
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
