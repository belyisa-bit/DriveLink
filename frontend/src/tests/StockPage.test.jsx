import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { StockPage } from '../pages/StockPage';
import { api } from '../lib/axios';
import { searchMockCatalog, mockCatalogFilters } from '../features/catalog/mockCatalog';
import { mockFeaturedVehicles } from '../features/home/mockFeaturedVehicles';

const sampleDates = ['2026-09-01T12:00:00Z', '2026-10-01T12:00:00Z', '2026-09-15T12:00:00Z'];
const testVehicles = mockFeaturedVehicles.map((vehicle, index) => ({ ...vehicle, createdAt: sampleDates[index] }));

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

function Location() {
  const navigate = useNavigate();
  return <><p data-testid="query">{useLocation().search}</p><button onClick={() => navigate(-1)}>Voltar no histórico</button><button onClick={() => navigate(1)}>Avançar no histórico</button></>;
}

function renderStock(url = '/estoque') {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[url]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><StockPage /><Location /></MemoryRouter></QueryClientProvider>);
}

describe('Busca no estoque', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.get.mockImplementation((url, { params }) => Promise.resolve({ data: url === '/vehicles/filters' ? mockCatalogFilters() : searchMockCatalog(params, testVehicles) }));
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

  it.each([
    ['recent', ['Jeep Compass', 'Chevrolet Onix', 'Toyota Corolla']],
    ['price_asc', ['Chevrolet Onix', 'Toyota Corolla', 'Jeep Compass']],
    ['price_desc', ['Jeep Compass', 'Toyota Corolla', 'Chevrolet Onix']],
    ['mileage_asc', ['Jeep Compass', 'Chevrolet Onix', 'Toyota Corolla']],
  ])('ordena os cards por %s', async (sort, names) => {
    renderStock();
    await screen.findByRole('heading', { name: '3 veículos encontrados' });
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: sort } });
    await waitFor(() => {
      const cards = screen.getAllByRole('article');
      expect(cards.map((card) => within(card).getByRole('heading').textContent)).toEqual(names);
    });
    expect(screen.getByLabelText('Ordenar por')).toHaveValue(sort);
    expect(screen.getByTestId('query').textContent).toBe(sort === 'recent' ? '' : `?sortBy=${sort}`);
  });

  it('mantém filtros ao ordenar, reinicia a página e usa o singular no contador', async () => {
    renderStock('/estoque?search=Corolla&brand=Toyota&maxPrice=150000&page=3');
    await screen.findByRole('heading', { name: '1 veículo encontrado' });
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'price_asc' } });
    expect(screen.getByTestId('query').textContent).toBe('?search=Corolla&brand=Toyota&maxPrice=150000&sortBy=price_asc');
    expect(await screen.findByRole('heading', { name: '1 veículo encontrado' })).toBeInTheDocument();
  });

  it('informa total zero e trata uma ordem desconhecida como mais recentes', async () => {
    renderStock('/estoque?search=inexistente&sortBy=invalid');
    expect(await screen.findByRole('heading', { name: '0 veículos encontrados' })).toBeInTheDocument();
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('recent');
  });

  it('restaura campos, ordem e resultados ao recarregar um link e navegar no histórico', async () => {
    const url = '/estoque?search=Corolla&brand=Toyota&model=Corolla&minYear=2022&maxYear=2022&maxPrice=150000&sortBy=price_desc';
    const first = renderStock(url);
    await waitFor(() => expect(screen.getByLabelText('Ano')).toHaveValue('2022'));
    first.unmount();
    renderStock(url);
    await waitFor(() => expect(screen.getByLabelText('Ano')).toHaveValue('2022'));
    expect(screen.getByRole('searchbox')).toHaveValue('Corolla');
    expect(screen.getByLabelText('Marca')).toHaveValue('Toyota');
    expect(screen.getByLabelText('Modelo')).toHaveValue('Corolla');
    expect(screen.getByLabelText('Faixa de preço')).toHaveValue(':150000');
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('price_desc');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByTestId('query').textContent).toBe('?search=Corolla&sortBy=price_desc');
    fireEvent.click(screen.getByRole('button', { name: 'Voltar no histórico' }));
    await waitFor(() => expect(screen.getByLabelText('Ano')).toHaveValue('2022'));
    expect(screen.getByLabelText('Marca')).toHaveValue('Toyota');
    expect(await screen.findByRole('heading', { name: '1 veículo encontrado' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Avançar no histórico' }));
    expect(screen.getByLabelText('Marca')).toHaveValue('');
    expect(screen.getByLabelText('Modelo')).toHaveValue('');
    expect(screen.getByLabelText('Ano')).toHaveValue('');
    expect(screen.getByLabelText('Ordenar por')).toHaveValue('price_desc');
  });

  it('preserva um filtro ainda não aplicado ao ordenar e limpa esse rascunho sem mudar a URL', async () => {
    renderStock();
    await screen.findByRole('option', { name: 'Toyota' });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    await screen.findByRole('option', { name: 'Corolla' });
    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'price_asc' } });
    expect(screen.getByLabelText('Marca')).toHaveValue('Toyota');
    expect(screen.getByTestId('query').textContent).toBe('?sortBy=price_asc');
    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getByLabelText('Marca')).toHaveValue('');
    expect(screen.getByTestId('query').textContent).toBe('?sortBy=price_asc');
  });

});
