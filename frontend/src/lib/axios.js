import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://drivelink.onrender.com';

const apiBaseUrl = (configuredApiUrl || defaultApiUrl)
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
