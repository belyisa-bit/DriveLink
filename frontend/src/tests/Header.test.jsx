import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../components/Header';

describe('Header', () => {
  it('marca Estoque como ativo também na rota de detalhe', () => {
    render(<MemoryRouter initialEntries={['/estoque/jeep-compass']}><Header /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Estoque' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: /Quero atendimento/ })).toHaveAttribute('href', '/atendimento');
  });

  it('abre o menu e fecha com Escape, devolvendo o foco ao botão', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Header /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    expect(screen.getByRole('button', { name: 'Fechar menu' })).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveFocus();
  });

  it('fecha o menu após navegar', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Header /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: 'Abrir menu' }));
    await user.click(screen.getByRole('link', { name: 'Estoque' }));
    expect(screen.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('link', { name: 'Estoque' })).toHaveAttribute('aria-current', 'page');
  });

  it('não exibe Destaques no menu e mantém os links principais', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    expect(screen.queryByRole('link', { name: 'Destaques' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Estoque' })).toHaveAttribute('href', '/estoque');
    expect(screen.getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/sobre');
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute('href', '/contato');
  });
});
