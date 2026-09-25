import axios from 'axios';

// In production or on Vercel deployments, always use relative '/api' so requests always match the current domain/deployment.
const envUrl = (import.meta.env.VITE_API_URL || '').trim();
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

let configured = '/api';
if (import.meta.env.DEV || isLocalhost) {
  configured = envUrl || 'http://localhost:5000/api';
} else {
  // In production, always use relative '/api' to prevent pointing to stale preview URLs
  configured = '/api';
}

export const API_ORIGIN = typeof window !== 'undefined' ? window.location.origin : '';

export const api = axios.create({
  baseURL: configured,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export function mediaUrl(path?: string): string {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(error.response?.data?.message || error.message || 'Request failed'))
);
