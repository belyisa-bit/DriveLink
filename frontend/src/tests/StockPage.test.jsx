import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { StockPage } from '../pages/StockPage';
import { api } from '../lib/axios';
import { searchMockCatalog, mockCatalogFilters } from '../features/catalog/mockCatalog';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

function Location() {
  return <p data-testid="query">{useLocation().search}</p>;
}

function renderStock(url = '/estoque') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><StockPage /><Location /></MemoryRouter></QueryClientProvider>);
}

describe('Busca no estoque', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.get.mockImplementation((url, { params }) => Promise.resolve({ data: url === '/vehicles/filters' ? mockCatalogFilters() : searchMockCatalog(params) }));
  });

  it('busca somente ao enviar e remove espaços nas extremidades', async () => {
    renderStock();
    await screen.findByRole('heading', { name: 'Chevrolet Onix' });
    const requests = api.get.mock.calls.length;
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  Compass  ' } });
    expect(api.get).toHaveBeenCalledTimes(requests);
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(screen.getByTestId('query')).toHaveTextContent('?search=Compass');
    await screen.findByRole('heading', { name: 'Jeep Compass' });
    expect(screen.queryByRole('heading', { name: 'Chevrolet Onix' })).not.toBeInTheDocument();
    expect(api.get).toHaveBeenLastCalledWith('/vehicles', expect.objectContaining({ params: { search: 'Compass' } }));
  });

  it('preserva os filtros vindos da Home e reinicia a página ao buscar', async () => {
    renderStock('/estoque?brand=Toyota&maxPrice=150000&page=3');
    await screen.findByRole('heading', { name: 'Toyota Corolla' });
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Corolla' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(screen.getByTestId('query').textContent).toBe('?brand=Toyota&maxPrice=150000&search=Corolla');
  });

  it('exibe estado vazio e permite remover a busca', async () => {
    renderStock('/estoque?search=inexistente');
    expect(await screen.findByText(/Nenhum veículo encontrado/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: '  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(await screen.findByRole('heading', { name: 'Toyota Corolla' })).toBeInTheDocument();
    expect(screen.getByTestId('query').textContent).toBe('');
  });

  it('oferece nova tentativa quando a consulta falha', async () => {
    api.get.mockRejectedValueOnce(new Error('offline'));
    renderStock();
    fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'Jeep Compass' })).toBeInTheDocument();
  });

  it('aplica os filtros somente ao confirmar e atualiza os modelos pela marca', async () => {
    renderStock();
    await screen.findByRole('option', { name: 'Toyota' });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    await screen.findByRole('option', { name: 'Corolla' });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Corolla' } });
    await screen.findByRole('option', { name: '2022' });
    fireEvent.change(screen.getByLabelText('Ano'), { target: { value: '2022' } });
    expect(screen.getByTestId('query').textContent).toBe('');
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(screen.getByTestId('query').textContent).toBe('?brand=Toyota&model=Corolla&minYear=2022&maxYear=2022');
    await screen.findByRole('heading', { name: 'Toyota Corolla' });
    expect(screen.queryByRole('heading', { name: 'Jeep Compass' })).not.toBeInTheDocument();
  });

  it('limpa os filtros sem apagar o termo de busca', async () => {
    renderStock('/estoque?search=Corolla&brand=Toyota&minPrice=100000&page=2');
    await screen.findByRole('heading', { name: 'Toyota Corolla' });
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByTestId('query').textContent).toBe('?search=Corolla');
    expect(screen.getByLabelText('Marca')).toHaveValue('');
  });

  it('mantém o preço recebido da URL e não aplica ano sem modelo selecionado', async () => {
    renderStock('/estoque?minYear=2021&maxYear=2024&minPrice=150000.01');
    await screen.findByRole('option', { name: 'Toyota' });
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(screen.getByTestId('query').textContent).toBe('?minPrice=150000.01');
  });
});
