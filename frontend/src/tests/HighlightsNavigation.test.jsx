import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { App } from '../App';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn(async (url) => ({ data: url === '/vehicles/filters' ? { brands: [] } : url === '/vehicles/featured' ? [] : { content: [], totalElements: 0, totalPages: 0 } })) } }));

const originalScroll = Object.getOwnPropertyDescriptor(Element.prototype, 'scrollIntoView');
let scroll;
beforeEach(() => {
  scroll = vi.fn();
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: scroll });
});
afterEach(() => {
  vi.restoreAllMocks();
  if (originalScroll) Object.defineProperty(Element.prototype, 'scrollIntoView', originalScroll);
  else delete Element.prototype.scrollIntoView;
  window.history.replaceState({}, '', '/');
});

it('abre a seção da Home pelo link direto e permite voltar ao início', async () => {
  window.history.replaceState({}, '', '/#destaques');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Veículos em destaque' })).toBeInTheDocument();
  expect(window.location.pathname + window.location.hash).toBe('/#destaques');
  expect(screen.queryByRole('link', { name: 'Destaques' })).not.toBeInTheDocument();
  expect(scroll).toHaveBeenCalledWith({ block: 'start' });
  expect(screen.queryByText('Página em desenvolvimento.')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Início' }));
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0 }));
  expect(window.location.hash).toBe('');
});

it('redireciona o endereço antigo para a seção da Home', async () => {
  window.history.replaceState({}, '', '/destaques');
  render(<App />);
  expect(await screen.findByRole('heading', { name: 'Veículos em destaque' })).toBeInTheDocument();
  expect(window.location.pathname + window.location.hash).toBe('/#destaques');
  expect(scroll).toHaveBeenCalledWith({ block: 'start' });
  expect(screen.queryByText('Página em desenvolvimento.')).not.toBeInTheDocument();
});
