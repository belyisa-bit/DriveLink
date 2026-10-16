import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
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
