import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      issues: error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }))
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
    res.status(409).json({ message: 'A record with the same unique value already exists.' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
}
