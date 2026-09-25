import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState >= 1) return;
  mongoose.set('strictQuery', true);

  if (env.MONGODB_URI && !env.MONGODB_URI.includes('YOUR_DB_USER')) {
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
        throw new Error(`MongoDB connection failed on Vercel: ${message}. Please check MONGODB_URI in Vercel environment variables.`);
      }
      console.warn('[INFO] Starting in-memory MongoDB fallback for local development...\n');
    }
  }

  if (process.env.VERCEL) {
    throw new Error('MONGODB_URI must be configured in Vercel project environment variables.');
  }

  // Fallback to in-memory MongoDB for local development
  try {
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB connected (In-Memory Fallback): ${mongoose.connection.name}`);
  } catch (memErr) {
    console.error('Failed to start in-memory MongoDB:', memErr);
    throw memErr;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
}
