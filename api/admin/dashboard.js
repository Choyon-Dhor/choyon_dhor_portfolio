import { content, pages } from '../public/starter-data.js';

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

export default function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Count distribution by type
  const countsMap = {};
  for (const item of content) {
    countsMap[item.type] = (countsMap[item.type] || 0) + 1;
  }
  const contentCounts = Object.entries(countsMap).map(([_id, count]) => ({ _id, count }));

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({
    contentCounts,
    unreadMessages: 0,
    totalPages: pages.length,
    recentMessages: [],
    mediaCount: 0
  }));
}
