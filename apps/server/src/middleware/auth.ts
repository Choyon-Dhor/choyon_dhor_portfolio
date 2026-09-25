import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError.js';
import { verifyToken } from '../utils/auth.js';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string; role: 'admin' };
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.nexus_token as string | undefined;
  if (!token) return next(new AppError(401, 'Authentication required'));

  try {
    req.auth = verifyToken(token);
    next();
  } catch {
    next(new AppError(401, 'Session expired or invalid'));
  }
}
