import crypto from 'node:crypto';

function setCors(req, res) {
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
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

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const cookieHeader = req.headers?.cookie || '';
  const match = cookieHeader.match(/nexus_token=([^;]+)/);
  const authHeader = req.headers?.authorization || '';
  const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
  const token = match ? match[1] : (bearerMatch ? bearerMatch[1] : null);

  if (!token) {
    return sendJson(res, 401, { message: 'Authentication required' });
  }

  const jwtSecret = (process.env.JWT_SECRET || 'development-only-secret-change-before-production-32-chars').padEnd(32, '_');
  const decoded = verifyJwt(token, jwtSecret);

  if (!decoded) {
    return sendJson(res, 401, { message: 'Session expired or invalid' });
  }

  return sendJson(res, 200, {
    user: {
      id: decoded.userId || 'admin-1',
      name: process.env.ADMIN_NAME || 'Choyon Dhor',
      email: decoded.email || process.env.ADMIN_EMAIL || 'choyondhorshuva@gmail.com',
      role: 'admin'
    }
  });
}
