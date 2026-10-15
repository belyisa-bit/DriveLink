import { api } from '../lib/axios';
import {
  loginAdmin,
  getAdminToken,
  logoutAdmin,
} from '../features/admin/adminAuthApi';

vi.mock('../lib/axios', () => ({
  api: { post: vi.fn() },
}));

beforeEach(() => {
  api.post.mockReset();
  sessionStorage.clear();
});

it('realiza login e armazena o token', async () => {
  const response = {
    token: 'token-de-teste',
    tokenType: 'Bearer',
    expiresIn: 3600,
  };

  api.post.mockResolvedValue({ data: response });

  await expect(
    loginAdmin('admin@drivelink.com', 'senha123'),
  ).resolves.toEqual(response);

  expect(api.post).toHaveBeenCalledWith('/auth/login', {
    email: 'admin@drivelink.com',
    password: 'senha123',
  });
  expect(getAdminToken()).toBe('token-de-teste');
  expect(sessionStorage.getItem('drivelink_admin_token_type')).toBe('Bearer');
});

it('rejeita uma resposta sem token', async () => {
  api.post.mockResolvedValue({ data: {} });

  await expect(
    loginAdmin('admin@drivelink.com', 'senha123'),
  ).rejects.toThrow('Resposta inválida ao realizar login.');

  expect(getAdminToken()).toBeNull();
});

it('remove o token ao encerrar a sessão', async () => {
  api.post.mockResolvedValue({
    data: {
      token: 'token-de-teste',
      tokenType: 'Bearer',
      expiresIn: 3600,
    },
  });

  await loginAdmin('admin@drivelink.com', 'senha123');
  logoutAdmin();

  expect(getAdminToken()).toBeNull();
  expect(sessionStorage.getItem('drivelink_admin_token_type')).toBeNull();
});
