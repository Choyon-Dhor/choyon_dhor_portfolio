import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { signToken, verifyToken } from '../utils/auth.js';
import { contactSchema, contentSchema, loginSchema } from '../validators/schemas.js';

const health = await request(app).get('/api/health').expect(200);
assert.equal(health.body.status, 'ok');
assert.equal(health.body.service, 'choyon-nexus-api');

const token = signToken({ userId: '507f1f77bcf86cd799439011', role: 'admin' });
assert.equal(verifyToken(token).role, 'admin');

loginSchema.parse({ email: 'admin@example.com', password: 'ChangeMe123!' });
contactSchema.parse({ name: 'Test Visitor', email: 'visitor@example.com', subject: 'Test subject', message: 'A valid contact message.', website: '' });
contentSchema.parse({
  type: 'project', title: 'Test Project', slug: 'test-project', summary: 'A valid project record.',
  content: '', category: 'Test', status: 'Draft', organization: '', location: '', startDate: '', endDate: '', publishedAt: '',
  featured: false, visible: true, order: 1, tags: [], technologies: [], metrics: [], links: [], coverImage: '', gallery: [], metadata: {}
});

console.log('Smoke test passed: health endpoint, JWT helpers and request validation are operational.');
