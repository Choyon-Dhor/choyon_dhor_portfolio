import crypto from 'node:crypto';
import { initialSiteSettings, pages as defaultPages, content as defaultContent } from './_lib/starter-data.js';

let currentSettings = { ...initialSiteSettings };
let currentPages = defaultPages.map((p, i) => ({
  _id: p._id || p.slug || `page-${i + 1}`,
  ...p,
  _id: p._id || p.slug || `page-${i + 1}`
}));
let currentContent = defaultContent.map((c, i) => ({
  _id: c._id || c.slug || `item-${i + 1}`,
  ...c,
  _id: c._id || c.slug || `item-${i + 1}`
}));
let currentMessages = [
  {
    _id: 'msg-seed-1',
    name: 'Dr. Sarah Mitchell',
    email: 's.mitchell@research-lab.org',
    subject: 'Collaboration inquiry on Time-Series AI',
    organization: 'Neural Systems Lab',
    inquiryType: 'Research Collaboration',
    message: 'Hello Choyon, I reviewed your work on time-series forecasting and explainable AI models. We would love to discuss a potential joint research initiative.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: 'msg-seed-2',
    name: 'Alexandre Chen',
    email: 'alex.chen@techventures.io',
    subject: 'Consulting and Engineering Project',
    organization: 'Horizon Robotics',
    inquiryType: 'Project Inquiry',
    message: 'Hi Choyon, your portfolio projects show impressive depth in robotics and machine learning. Are you available for a remote consultancy or internship?',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

let currentMedia = [
  {
    _id: 'media-avatar-1',
    filename: 'avatar.jpg',
    url: '/placeholder.jpg',
    altText: 'Choyon Dhor profile photo',
    caption: 'Choyon Dhor – Lead Researcher & Developer',
    category: 'Profile',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'media-project-1',
    filename: 'project-cover.jpg',
    url: '/placeholder.jpg',
    altText: 'Research and project banner',
    caption: 'AI and Robotics System Interface',
    category: 'Projects',
    createdAt: new Date().toISOString()
  }
];

function setCors(req, res) {
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization');
}

function verifyJwt(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expected = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
    if (signature === expected) {
      return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    }
  } catch {}
  return null;
}

function checkAuth(req) {
  const cookieHeader = req.headers?.cookie || '';
  const match = cookieHeader.match(/nexus_token=([^;]+)/);
  const authHeader = req.headers?.authorization || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1] : (bearerMatch ? bearerMatch[1] : null);

  if (!token) return false;
  const jwtSecret = (process.env.JWT_SECRET || 'development-only-secret-change-before-production-32-chars').padEnd(32, '_');
  return !!verifyJwt(token, jwtSecret);
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

async function parseBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch {}
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString('utf8');
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!checkAuth(req)) {
    return sendJson(res, 401, { message: 'Authentication required' });
  }

  // Extract slug from req.query.slug or URL
  let slug = req.query?.slug;
  if (!slug) {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname.replace(/^\/api\/admin\/?/, '');
    slug = path.split('/').filter(Boolean);
  } else if (typeof slug === 'string') {
    slug = slug.split('/').filter(Boolean);
  } else if (Array.isArray(slug)) {
    slug = slug.flatMap(s => typeof s === 'string' ? s.split('/') : s).filter(Boolean);
  }

  const endpoint = slug[0] || 'dashboard';
  const subId = slug[1];

  try {
    if (endpoint === 'dashboard') {
      const typeCounts = {};
      currentContent.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      });
      const contentCounts = Object.entries(typeCounts).map(([_id, count]) => ({ _id, count }));
      return sendJson(res, 200, {
        contentCounts,
        unreadMessages: currentMessages.filter(m => m.status === 'new').length,
        totalPages: currentPages.length,
        recentMessages: currentMessages.slice(0, 5),
        mediaCount: currentMedia.length
      });
    }

    if (endpoint === 'settings') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { settings: currentSettings });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        currentSettings = { ...currentSettings, ...body, key: 'primary' };
        return sendJson(res, 200, { settings: currentSettings });
      }
    }

    if (endpoint === 'pages') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { pages: currentPages });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newPage = { _id: body._id || body.slug || ('page-' + Date.now()), ...body };
        currentPages.push(newPage);
        return sendJson(res, 201, { page: newPage });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = currentPages.findIndex(p => p._id === subId || p.slug === subId || (body.slug && p.slug === body.slug));
        if (idx !== -1) {
          currentPages[idx] = { ...currentPages[idx], ...body };
          return sendJson(res, 200, { page: currentPages[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : (body.slug || 'page-' + Date.now()), ...body };
        currentPages.push(created);
        return sendJson(res, 200, { page: created });
      }
      if (req.method === 'DELETE') {
        if (!subId || subId === 'undefined') {
          res.statusCode = 204;
          res.end();
          return;
        }
        currentPages = currentPages.filter(p => p._id !== subId && p.slug !== subId);
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'content') {
      if (req.method === 'GET') {
        const type = req.query?.type;
        const items = type ? currentContent.filter(c => c.type === type) : currentContent;
        return sendJson(res, 200, { items });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newItem = { _id: body._id || body.slug || ('item-' + Date.now()), ...body };
        currentContent.push(newItem);
        return sendJson(res, 201, { item: newItem });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = currentContent.findIndex(c => c._id === subId || c.slug === subId || (body.slug && c.slug === body.slug));
        if (idx !== -1) {
          currentContent[idx] = { ...currentContent[idx], ...body };
          return sendJson(res, 200, { item: currentContent[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : (body.slug || 'item-' + Date.now()), ...body };
        currentContent.push(created);
        return sendJson(res, 200, { item: created });
      }
      if (req.method === 'DELETE') {
        if (!subId || subId === 'undefined') {
          res.statusCode = 204;
          res.end();
          return;
        }
        currentContent = currentContent.filter(c => c._id !== subId && c.slug !== subId);
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'messages') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { messages: currentMessages });
      }
      if (req.method === 'PATCH') {
        const body = await parseBody(req);
        const msg = currentMessages.find(m => m._id === subId || m.id === subId);
        if (msg) {
          if (body.status) msg.status = body.status;
          return sendJson(res, 200, { message: msg });
        }
        return sendJson(res, 200, { message: { _id: subId, status: body.status || 'read' } });
      }
      if (req.method === 'DELETE') {
        currentMessages = currentMessages.filter(m => m._id !== subId && m.id !== subId);
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'media') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { assets: currentMedia, media: currentMedia });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newAsset = {
          _id: 'media-' + Date.now(),
          filename: 'media-' + Date.now() + '.jpg',
          url: '/placeholder.jpg',
          altText: '',
          caption: '',
          category: 'General',
          ...body
        };
        currentMedia.push(newAsset);
        return sendJson(res, 201, { asset: newAsset, media: newAsset });
      }
      if (req.method === 'PATCH' || req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = currentMedia.findIndex(m => m._id === subId || m.assetId === subId || m.url === subId);
        if (idx !== -1) {
          currentMedia[idx] = { ...currentMedia[idx], ...body };
          return sendJson(res, 200, { asset: currentMedia[idx], media: currentMedia[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : ('media-' + Date.now()), url: '/placeholder.jpg', ...body };
        currentMedia.push(created);
        return sendJson(res, 200, { asset: created, media: created });
      }
      if (req.method === 'DELETE') {
        currentMedia = currentMedia.filter(m => m._id !== subId && m.assetId !== subId);
        res.statusCode = 204;
        res.end();
        return;
      }
      return sendJson(res, 200, { success: true });
    }

    return sendJson(res, 404, { message: 'Unknown admin route: ' + endpoint });
  } catch (err) {
    return sendJson(res, 500, { message: err.message || 'Internal server error' });
  }
}
