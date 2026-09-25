import fs from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { ContentItem } from '../models/ContentItem.js';
import { MediaAsset } from '../models/MediaAsset.js';
import { Page } from '../models/Page.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { getFileTypeFromMimeType, findMediaUsages } from '../utils/media.js';
import { uploadsDirectory } from '../utils/paths.js';
import { contentSchema, mediaAssetUpdateSchema, pageSchema, siteSettingsSchema } from '../validators/schemas.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', asyncHandler(async (_req, res) => {
  const [contentCounts, unreadMessages, totalPages, recentMessages, mediaCount] = await Promise.all([
    ContentItem.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    ContactMessage.countDocuments({ status: 'new' }),
    Page.countDocuments(),
    ContactMessage.find().sort({ createdAt: -1 }).limit(5).lean(),
    MediaAsset.countDocuments()
  ]);
  res.json({ contentCounts, unreadMessages, totalPages, recentMessages, mediaCount });
}));

router.get('/content', asyncHandler(async (req, res) => {
  const filter = req.query.type ? { type: req.query.type } : {};
  const items = await ContentItem.find(filter).sort({ order: 1, updatedAt: -1 }).lean();
  res.json({ items });
}));

router.post('/content', asyncHandler(async (req, res) => {
  const data = contentSchema.parse(req.body);
  const item = await ContentItem.create(normalizeDates(data));
  res.status(201).json({ item });
}));

router.put('/content/:id', asyncHandler(async (req, res) => {
  const data = contentSchema.parse(req.body);
  const item = await ContentItem.findByIdAndUpdate(req.params.id, normalizeDates(data), { new: true, runValidators: true });
  if (!item) throw new AppError(404, 'Content item not found');
  res.json({ item });
}));

router.delete('/content/:id', asyncHandler(async (req, res) => {
  const item = await ContentItem.findByIdAndDelete(req.params.id);
  if (!item) throw new AppError(404, 'Content item not found');
  res.status(204).send();
}));

router.get('/pages', asyncHandler(async (_req, res) => {
  const pages = await Page.find().sort({ order: 1 }).lean();
  res.json({ pages });
}));

router.post('/pages', asyncHandler(async (req, res) => {
  const page = await Page.create(pageSchema.parse(req.body));
  res.status(201).json({ page });
}));

router.put('/pages/:id', asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, pageSchema.parse(req.body), { new: true, runValidators: true });
  if (!page) throw new AppError(404, 'Page not found');
  res.json({ page });
}));

router.delete('/pages/:id', asyncHandler(async (req, res) => {
  const page = await Page.findByIdAndDelete(req.params.id);
  if (!page) throw new AppError(404, 'Page not found');
  res.status(204).send();
}));

router.get('/settings', asyncHandler(async (_req, res) => {
  const settings = await SiteSettings.findOne({ key: 'primary' }).lean();
  res.json({ settings });
}));

router.put('/settings', asyncHandler(async (req, res) => {
  const data = siteSettingsSchema.parse(req.body);
  const settings = await SiteSettings.findOneAndUpdate(
    { key: 'primary' },
    { ...data, key: 'primary' },
    { new: true, upsert: true, runValidators: true }
  );
  res.json({ settings });
}));

router.get('/messages', asyncHandler(async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ messages });
}));

router.patch('/messages/:id', asyncHandler(async (req, res) => {
  const status = req.body.status;
  if (!['new', 'read', 'archived'].includes(status)) throw new AppError(400, 'Invalid message status');
  const message = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!message) throw new AppError(404, 'Message not found');
  res.json({ message });
}));

router.delete('/messages/:id', asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new AppError(404, 'Message not found');
  res.status(204).send();
}));

router.post('/media', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 12 }]), asyncHandler(async (req, res) => {
  const fileMap = req.files as Record<string, Express.Multer.File[]> | undefined;
  const files = [...(fileMap?.file || []), ...(fileMap?.files || [])];
  if (!files.length) throw new AppError(400, 'No file uploaded');

  const assets = await Promise.all(files.map(async (file) => MediaAsset.create({
    filename: file.filename,
    originalName: file.originalname,
    url: `/uploads/${file.filename}`,
    thumbnailUrl: `/uploads/${file.filename}`,
    mimeType: file.mimetype,
    fileType: getFileTypeFromMimeType(file.mimetype),
    fileSize: file.size,
    uploadedBy: req.auth?.userId || ''
  })));

  res.status(201).json({ assets });
}));

router.get('/media', asyncHandler(async (req, res) => {
  const filters: Record<string, unknown> = {};
  if (req.query.fileType) filters.fileType = String(req.query.fileType);
  if (req.query.category) filters.category = String(req.query.category);
  if (req.query.search) {
    const regex = new RegExp(String(req.query.search), 'i');
    filters.$or = [{ originalName: regex }, { filename: regex }, { caption: regex }, { altText: regex }, { description: regex }];
  }

  const assets = await MediaAsset.find(filters).sort({ createdAt: -1 }).lean();
  const withUsage = await Promise.all(assets.map(async (asset) => ({
    ...asset,
    usedBy: await findMediaUsages(asset.url)
  })));
  res.json({ assets: withUsage });
}));

router.patch('/media/:id', asyncHandler(async (req, res) => {
  const data = mediaAssetUpdateSchema.parse(req.body);
  const asset = await MediaAsset.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).lean();
  if (!asset) throw new AppError(404, 'Media asset not found');
  res.json({ asset });
}));

router.delete('/media/:id', asyncHandler(async (req, res) => {
  const asset = await MediaAsset.findById(req.params.id).lean();
  if (!asset) throw new AppError(404, 'Media asset not found');

  const usedBy = await findMediaUsages(asset.url);
  if (usedBy.length) throw new AppError(400, `Media is still in use by: ${usedBy.join(', ')}`);

  await MediaAsset.findByIdAndDelete(req.params.id);
  await fs.unlink(path.resolve(uploadsDirectory, path.basename(asset.filename))).catch(() => undefined);
  res.status(204).send();
}));

function normalizeDates<T extends Record<string, unknown>>(data: T): T {
  const next: Record<string, unknown> = { ...data };
  for (const key of ['startDate', 'endDate', 'publishedAt']) {
    if (next[key] === '' || next[key] === null) next[key] = undefined;
  }
  return next as T;
}

export default router;
