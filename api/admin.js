import crypto from 'node:crypto';
import { store } from './_lib/store.js';

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

  // Extract slug from req.query.slug or URL
  let slug = req.query?.slug;
  if (!slug) {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname.replace(/^\/api\/(admin|public)\/?/, '');
    slug = path.split('/').filter(Boolean);
  } else if (typeof slug === 'string') {
    slug = slug.split('/').filter(Boolean);
  } else if (Array.isArray(slug)) {
    slug = slug.flatMap(s => typeof s === 'string' ? s.split('/') : s).filter(Boolean);
  }

  const parsedUrl = new URL(req.url, 'http://localhost');
  const isPublic = req.query?.public === 'true' || parsedUrl.pathname.startsWith('/api/public');

  // Handle public requests without requiring auth
  if (isPublic) {
    const pubEndpoint = slug[0] || 'bootstrap';
    if (pubEndpoint === 'bootstrap') {
      return sendJson(res, 200, {
        settings: store.getSettings(),
        pages: store.getPages(),
        items: store.getContent()
      });
    }
    if (pubEndpoint === 'content') {
      return sendJson(res, 200, {
        items: store.getContent(),
        content: store.getContent()
      });
    }
    if (pubEndpoint === 'contact' && req.method === 'POST') {
      const body = await parseBody(req);
      const newMsg = {
        _id: 'msg-' + Date.now(),
        name: body.name || 'Anonymous',
        email: body.email || '',
        subject: body.subject || 'Portfolio transmission',
        message: body.message || '',
        status: 'new',
        createdAt: new Date().toISOString()
      };
      const msgs = store.getMessages();
      msgs.unshift(newMsg);
      store.setMessages(msgs);
      return sendJson(res, 201, { id: newMsg._id, message: 'Transmission received successfully.' });
    }
  }

  if (!checkAuth(req)) {
    return sendJson(res, 401, { message: 'Authentication required' });
  }

  const endpoint = slug[0] || 'dashboard';
  const subId = slug[1];

  try {
    if (endpoint === 'dashboard') {
      const allContent = store.getContent();
      const allMessages = store.getMessages();
      const allPages = store.getPages();
      const allMedia = store.getMedia();
      const typeCounts = {};
      allContent.forEach(item => {
        typeCounts[item.type] = (typeCounts[item.type] || 0) + 1;
      });
      const contentCounts = Object.entries(typeCounts).map(([_id, count]) => ({ _id, count }));
      return sendJson(res, 200, {
        contentCounts,
        unreadMessages: allMessages.filter(m => m.status === 'new').length,
        totalPages: allPages.length,
        recentMessages: allMessages.slice(0, 5),
        mediaCount: allMedia.length
      });
    }

    if (endpoint === 'settings') {
      if (req.method === 'GET') {
        return sendJson(res, 200, { settings: store.getSettings() });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const updated = store.updateSettings(body);
        return sendJson(res, 200, { settings: updated });
      }
    }

    if (endpoint === 'pages') {
      let pages = store.getPages();
      if (req.method === 'GET') {
        return sendJson(res, 200, { pages });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newPage = { _id: body._id || body.slug || ('page-' + Date.now()), ...body };
        pages.push(newPage);
        store.setPages(pages);
        return sendJson(res, 201, { page: newPage });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = pages.findIndex(p => p._id === subId || p.slug === subId || (body.slug && p.slug === body.slug));
        if (idx !== -1) {
          pages[idx] = { ...pages[idx], ...body };
          store.setPages(pages);
          return sendJson(res, 200, { page: pages[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : (body.slug || 'page-' + Date.now()), ...body };
        pages.push(created);
        store.setPages(pages);
        return sendJson(res, 200, { page: created });
      }
      if (req.method === 'DELETE') {
        if (subId && subId !== 'undefined') {
          pages = pages.filter(p => p._id !== subId && p.slug !== subId);
          store.setPages(pages);
        }
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'content') {
      let contentList = store.getContent();
      if (req.method === 'GET') {
        const type = req.query?.type;
        const items = type ? contentList.filter(c => c.type === type) : contentList;
        return sendJson(res, 200, { items, content: items });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newItem = { _id: body._id || body.slug || ('item-' + Date.now()), ...body };
        contentList.push(newItem);
        store.setContent(contentList);
        return sendJson(res, 201, { item: newItem });
      }
      if (req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = contentList.findIndex(c => c._id === subId || c.slug === subId || (body.slug && c.slug === body.slug));
        if (idx !== -1) {
          contentList[idx] = { ...contentList[idx], ...body };
          store.setContent(contentList);
          return sendJson(res, 200, { item: contentList[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : (body.slug || 'item-' + Date.now()), ...body };
        contentList.push(created);
        store.setContent(contentList);
        return sendJson(res, 200, { item: created });
      }
      if (req.method === 'DELETE') {
        if (subId && subId !== 'undefined') {
          contentList = contentList.filter(c => c._id !== subId && c.slug !== subId);
          store.setContent(contentList);
        }
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'messages') {
      let messages = store.getMessages();
      if (req.method === 'GET') {
        return sendJson(res, 200, { messages });
      }
      if (req.method === 'PATCH') {
        const body = await parseBody(req);
        const msg = messages.find(m => m._id === subId || m.id === subId);
        if (msg) {
          if (body.status) msg.status = body.status;
          store.setMessages(messages);
          return sendJson(res, 200, { message: msg });
        }
        return sendJson(res, 200, { message: { _id: subId, status: body.status || 'read' } });
      }
      if (req.method === 'DELETE') {
        messages = messages.filter(m => m._id !== subId && m.id !== subId);
        store.setMessages(messages);
        res.statusCode = 204;
        res.end();
        return;
      }
    }

    if (endpoint === 'media') {
      let mediaList = store.getMedia();
      if (req.method === 'GET') {
        return sendJson(res, 200, { assets: mediaList, media: mediaList });
      }
      if (req.method === 'POST') {
        const body = await parseBody(req);
        const newAsset = {
          _id: body._id || ('media-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
          filename: body.filename || body.originalName || ('media-' + Date.now() + '.jpg'),
          originalName: body.originalName || body.filename || 'media',
          url: body.url || '/placeholder.jpg',
          thumbnailUrl: body.thumbnailUrl || body.url || '/placeholder.jpg',
          altText: body.altText || '',
          caption: body.caption || '',
          category: body.category || 'General',
          mimeType: body.mimeType || 'image/jpeg',
          fileType: body.fileType || 'image',
          fileSize: body.fileSize || 0,
          createdAt: new Date().toISOString(),
          ...body
        };
        mediaList.unshift(newAsset);
        store.setMedia(mediaList);
        return sendJson(res, 201, { asset: newAsset, media: newAsset, assets: [newAsset] });
      }
      if (req.method === 'PATCH' || req.method === 'PUT') {
        const body = await parseBody(req);
        const idx = mediaList.findIndex(m => m._id === subId || m.assetId === subId || m.url === subId);
        if (idx !== -1) {
          mediaList[idx] = { ...mediaList[idx], ...body };
          store.setMedia(mediaList);
          return sendJson(res, 200, { asset: mediaList[idx], media: mediaList[idx] });
        }
        const created = { _id: subId && subId !== 'undefined' ? subId : ('media-' + Date.now()), url: '/placeholder.jpg', ...body };
        mediaList.push(created);
        store.setMedia(mediaList);
        return sendJson(res, 200, { asset: created, media: created });
      }
      if (req.method === 'DELETE') {
        mediaList = mediaList.filter(m => m._id !== subId && m.assetId !== subId);
        store.setMedia(mediaList);
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
