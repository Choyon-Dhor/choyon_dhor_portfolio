import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { ContentItem } from './models/ContentItem.js';
import { Page } from './models/Page.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { uploadsDirectory } from './utils/paths.js';

export const app = express();

const clientOrigins = env.CLIENT_URL.split(',').map((value) => value.trim()).filter(Boolean);
const publicOrigin = clientOrigins[0] || 'http://localhost:5173';

app.set('trust proxy', 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || clientOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: 'draft-8', legacyHeaders: false }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(uploadsDirectory, { maxAge: '7d', immutable: true }));

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *\nAllow: /\nSitemap: ${publicOrigin.replace(/\/$/, '')}/sitemap.xml\n`);
});

app.get('/sitemap.xml', asyncHandler(async (_req, res) => {
  const [pages, items] = await Promise.all([
    Page.find({ visible: true }).sort({ order: 1, title: 1 }).lean(),
    ContentItem.find({ visible: true }).sort({ order: 1, updatedAt: -1 }).lean()
  ]);

  const routes = [
    { path: '/', updatedAt: new Date().toISOString() },
    ...pages
      .map((page) => ({
        path: page.slug === 'home' ? '/' : `/${page.slug}`,
        updatedAt: page.updatedAt instanceof Date ? page.updatedAt.toISOString() : new Date(page.updatedAt || Date.now()).toISOString()
      })),
    ...items
      .map((item) => {
        const section = getContentPath(item.type, item.slug);
        if (!section) return null;
        return {
          path: section,
          updatedAt: item.updatedAt instanceof Date ? item.updatedAt.toISOString() : new Date(item.updatedAt || Date.now()).toISOString()
        };
      })
      .filter((entry): entry is { path: string; updatedAt: string } => Boolean(entry))
  ];

  const uniqueRoutes = Array.from(new Map(routes.map((route) => [route.path, route])).values());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueRoutes.map((route) => `  <url>\n    <loc>${escapeXml(`${publicOrigin.replace(/\/$/, '')}${route.path}`)}</loc>\n    <lastmod>${route.updatedAt}</lastmod>\n  </url>`).join('\n')}\n</urlset>`;

  res.type('application/xml').send(xml);
}));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'choyon-nexus-api', timestamp: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

function getContentPath(type: string, slug: string): string | null {
  switch (type) {
    case 'research': return `/research/${slug}`;
    case 'project': return `/projects/${slug}`;
    case 'publication': return `/publications/${slug}`;
    case 'experience': return `/leadership/${slug}`;
    case 'activity': return `/activities/${slug}`;
    case 'event': return `/events/${slug}`;
    case 'achievement': return `/awards/${slug}`;
    case 'skill': return `/skills/${slug}`;
    case 'education': return `/education/${slug}`;
    case 'blog': return `/blog/${slug}`;
    default: return null;
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
