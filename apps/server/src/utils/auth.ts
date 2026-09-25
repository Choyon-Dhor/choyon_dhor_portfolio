import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export type AuthPayload = { userId: string; role: 'admin' };

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}
