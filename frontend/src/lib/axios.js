import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!import.meta.env.DEV && !configuredApiUrl) {
  throw new Error(
    'VITE_API_URL não configurada. Defina a URL pública do backend Render nas variáveis de ambiente da Vercel.',
  );
}

const apiBaseUrl = (configuredApiUrl || 'http://localhost:8080')
  .replace(/\/+$/, '')
  .replace(/\/api\/v1$/, '');

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('drivelink_admin_token');
  const tokenType =
    sessionStorage.getItem('drivelink_admin_token_type') || 'Bearer';

  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }

  return config;
});
