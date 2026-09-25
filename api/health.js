export default function handler(_req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ status: 'ok', service: 'choyon-nexus-api', timestamp: new Date().toISOString() });
}
