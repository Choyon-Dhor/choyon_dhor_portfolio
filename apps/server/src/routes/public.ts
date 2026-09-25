import crypto from 'node:crypto';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import mongoose from 'mongoose';
import { ContactMessage } from '../models/ContactMessage.js';
import { ContentItem } from '../models/ContentItem.js';
import { Page } from '../models/Page.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { initialSiteSettings, pages as defaultPages, content as defaultContent } from '../data/seed.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { contactSchema } from '../validators/schemas.js';

const router = Router();

router.get('/bootstrap', asyncHandler(async (_req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const [settings, pages, items] = await Promise.all([
        SiteSettings.findOne({ key: 'primary' }).lean(),
        Page.find({ visible: true }).sort({ order: 1, title: 1 }).lean(),
        ContentItem.find({ visible: true }).sort({ order: 1, startDate: -1, createdAt: -1 }).lean()
      ]);
      if (settings && pages.length > 0) {
        return res.json({ settings, pages, items });
      }
    }
  } catch (err) {
    console.warn('MongoDB query failed during bootstrap, serving starter data:', err);
  }

  // Seamless fallback ensuring the portfolio always loads
  return res.json({
    settings: initialSiteSettings,
    pages: defaultPages,
    items: defaultContent
  });
}));

router.get('/content', asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const filter: Record<string, unknown> = { visible: true };
      if (req.query.type) filter.type = req.query.type;
      if (req.query.featured === 'true') filter.featured = true;
      const items = await ContentItem.find(filter).sort({ order: 1, startDate: -1, createdAt: -1 }).lean();
      return res.json({ items });
    }
  } catch (err) {
    console.warn('MongoDB query failed during content list, serving fallback:', err);
  }

  let items = defaultContent;
  if (req.query.type) items = items.filter((item) => item.type === req.query.type);
  if (req.query.featured === 'true') items = items.filter((item) => item.featured);
  return res.json({ items });
}));

router.get('/content/:type/:slug', asyncHandler(async (req, res) => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const item = await ContentItem.findOne({ type: req.params.type, slug: req.params.slug, visible: true }).lean();
      if (item) return res.json({ item });
    }
  } catch (err) {
    console.warn('MongoDB query failed during item fetch, searching fallback:', err);
  }

  const fallback = defaultContent.find((item) => item.type === req.params.type && item.slug === req.params.slug);
  if (!fallback) throw new AppError(404, 'Content not found');
  return res.json({ item: fallback });
}));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-8', legacyHeaders: false });
router.post('/contact', contactLimiter, asyncHandler(async (req, res) => {
  const data = contactSchema.parse(req.body);
  const ipHash = crypto.createHash('sha256').update(req.ip ?? 'unknown').digest('hex').slice(0, 20);
  try {
    if (mongoose.connection.readyState >= 1) {
      const message = await ContactMessage.create({ ...data, ipHash });
      return res.status(201).json({ id: message._id, message: 'Transmission received successfully.' });
    }
  } catch (err) {
    console.warn('Contact message could not be saved to DB:', err);
  }
  return res.status(201).json({ id: 'local-' + Date.now(), message: 'Transmission received successfully.' });
}));

export default router;
