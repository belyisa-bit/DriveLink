import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AdminRoute } from '../features/admin/AdminRoute';

vi.mock('../features/admin/adminAuthApi', () => ({
  getAdminToken: vi.fn(),
}));

import { getAdminToken } from '../features/admin/adminAuthApi';

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redireciona para o login quando não existe token', () => {
    getAdminToken.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<h1>Login administrativo</h1>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<h1>Painel administrativo</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Login administrativo' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'Painel administrativo' }),
    ).not.toBeInTheDocument();
  });

  it('permite acesso quando existe token', () => {
    getAdminToken.mockReturnValue('token-de-teste');

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route path="/admin/login" element={<h1>Login administrativo</h1>} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<h1>Painel administrativo</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: 'Painel administrativo' }),
    ).toBeInTheDocument();
  });
});