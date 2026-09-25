import crypto from 'node:crypto';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ContactMessage } from '../models/ContactMessage.js';
import { ContentItem } from '../models/ContentItem.js';
import { Page } from '../models/Page.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { contactSchema } from '../validators/schemas.js';

const router = Router();

router.get('/bootstrap', asyncHandler(async (_req, res) => {
  const [settings, pages, items] = await Promise.all([
    SiteSettings.findOne({ key: 'primary' }).lean(),
    Page.find({ visible: true }).sort({ order: 1, title: 1 }).lean(),
    ContentItem.find({ visible: true }).sort({ order: 1, startDate: -1, createdAt: -1 }).lean()
  ]);
  res.json({ settings, pages, items });
}));

router.get('/content', asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = { visible: true };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.featured === 'true') filter.featured = true;
  const items = await ContentItem.find(filter).sort({ order: 1, startDate: -1, createdAt: -1 }).lean();
  res.json({ items });
}));

router.get('/content/:type/:slug', asyncHandler(async (req, res) => {
  const item = await ContentItem.findOne({ type: req.params.type, slug: req.params.slug, visible: true }).lean();
  if (!item) throw new AppError(404, 'Content not found');
  res.json({ item });
}));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
router.post('/contact', contactLimiter, asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const ipHash = crypto.createHash('sha256').update(req.ip ?? 'unknown').digest('hex').slice(0, 20);
  const message = await ContactMessage.create({ ...data, ipHash });
  res.status(201).json({ id: message._id, message: 'Transmission received successfully.' });
}));

export default router;
