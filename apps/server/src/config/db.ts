import mongoose from 'mongoose';
import { env } from './env.js';

let memoryServer: any = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.set('strictQuery', true);

  if (env.MONGODB_URI && env.MONGODB_URI.trim() && !env.MONGODB_URI.includes('YOUR_DB_USER')) {
    try {
      console.log('Connecting to primary MongoDB URI...');
      await mongoose.connect(env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB connected: ${mongoose.connection.name}`);
      return;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`\n[WARN] Primary MongoDB connection failed: ${message}`);
      if (process.env.VERCEL) {
        console.warn('[INFO] Vercel environment active. Serving starter data gracefully.\n');
        return;
      }
    }
  }

  if (process.env.VERCEL) {
    console.warn('[INFO] No MONGODB_URI configured in Vercel. Operating with in-memory starter data.');
    return;
  }

  // Fallback to in-memory MongoDB for local development
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB connected (In-Memory Fallback): ${mongoose.connection.name}`);
  } catch (memErr) {
    console.warn('Failed to start in-memory MongoDB, operating in memory-only mode:', memErr);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
