import { Router } from 'express';
import { env } from '../config/env.js';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { signToken } from '../utils/auth.js';
import { loginSchema } from '../validators/schemas.js';

const router = Router();

router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await user.comparePassword(password))) throw new AppError(401, 'Invalid email or password');

  user.lastLoginAt = new Date();
  await user.save();
  const token = signToken({ userId: user._id.toString(), role: 'admin' });
  res.cookie('nexus_token', token, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SECURE ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

router.post('/logout', (_req, res) => {
  res.clearCookie('nexus_token', { path: '/' });
  res.status(204).send();
});

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.auth!.userId).lean();
  if (!user) throw new AppError(401, 'User no longer exists');
  res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}));

export default router;
