import axios from 'axios';

const configured = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export const API_ORIGIN = configured.replace(/\/api\/?$/, '');

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
