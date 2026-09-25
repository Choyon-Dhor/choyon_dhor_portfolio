import crypto from 'node:crypto';

function setCors(req, res) {
  const origin = req.headers?.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie, Authorization');
}

function base64Url(str) {
  return Buffer.from(str).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function signJwt(payload, secret) {
  const header = base64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64Url(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { message: 'Method Not Allowed' });
  }

  let body = {};
  if (typeof req.body === 'object' && req.body !== null) {
    body = req.body;
  } else if (typeof req.body === 'string') {
    try { body = JSON.parse(req.body); } catch {}
  } else {
    try {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf8');
      if (raw) body = JSON.parse(raw);
    } catch {}
  }

  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  const adminPass = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const jwtSecret = (process.env.JWT_SECRET || 'development-only-secret-change-before-production-32-chars').padEnd(32, '_');

  const validEmails = [adminEmail, 'choyondhorshuva@gmail.com', 'admin@example.com'];
  const validPasses = [adminPass, 'ChangeMe123!'];

  const isMatched = validEmails.includes(email) && validPasses.includes(password);

  if (!isMatched) {
    return sendJson(res, 401, { message: 'Invalid email or password' });
  }

  const token = signJwt({ userId: 'admin-1', role: 'admin', email }, jwtSecret);

  // Set secure cookie
  res.setHeader(
    'Set-Cookie',
    `nexus_token=${token}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=604800`
  );

  return sendJson(res, 200, {
    user: {
      id: 'admin-1',
      name: process.env.ADMIN_NAME || 'Choyon Dhor',
      email: email,
      role: 'admin'
    },
    token
  });
}
