import { api } from '../../lib/axios';

const TOKEN_KEY = 'drivelink_admin_token';
const TOKEN_TYPE_KEY = 'drivelink_admin_token_type';

export async function loginAdmin(email, password) {
  const { data } = await api.post('/auth/login', { email, password });

  if (!data?.token) {
    throw new Error('Resposta inválida ao realizar login.');
  }

  sessionStorage.setItem(TOKEN_KEY, data.token);
  sessionStorage.setItem(TOKEN_TYPE_KEY, data.tokenType || 'Bearer');

  return data;
}

export function getAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function logoutAdmin() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_TYPE_KEY);
}
