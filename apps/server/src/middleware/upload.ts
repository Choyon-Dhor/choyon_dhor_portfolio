import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { AppError } from '../utils/AppError.js';
import { uploadsDirectory } from '../utils/paths.js';

const uploadDir = uploadsDirectory;

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}${extension}`);
  }
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'application/pdf',
  'video/mp4',
  'video/webm'
];

export const upload = multer({
  storage,
  limits: { fileSize: 12 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new AppError(400, 'Only JPEG, PNG, WebP, GIF, AVIF, PDF, MP4 and WebM files are allowed'));
      return;
    }
    callback(null, true);
  }
});
