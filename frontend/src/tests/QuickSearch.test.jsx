import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QuickSearch } from '../features/home/QuickSearch';
import { api } from '../lib/axios';
import { getBrandModels } from '../features/home/vehicleFilters';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

function Destination() {
  const location = useLocation();
  return <p data-testid="destination">{location.pathname}{location.search}</p>;
}

function renderSearch() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes><Route path="/" element={<QuickSearch />} /><Route path="/estoque" element={<Destination />} /></Routes></MemoryRouter></QueryClientProvider>);
}

describe('Busca rápida', () => {
  beforeEach(() => {
    api.get.mockReset();
    api.get.mockImplementation((url, config) => Promise.resolve({ data: url === '/vehicles/filters' ? { brands: ['Jeep', 'Toyota'] } : { content: [{ model: config.params.brand === 'Jeep' ? 'Compass' : 'Corolla' }], totalPages: 1 } }));
  });

  it('envia marca, modelo e limites de preço na URL', async () => {
    renderSearch();
    await screen.findByRole('option', { name: 'Jeep' });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Jeep' } });
    await screen.findByRole('option', { name: 'Compass' });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Compass' } });
    fireEvent.change(screen.getByLabelText('Faixa de preço'), { target: { value: '100to150' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(screen.getByTestId('destination')).toHaveTextContent('/estoque?brand=Jeep&model=Compass&minPrice=100000&maxPrice=150000');
  });

  it('limpa o modelo ao trocar de marca', async () => {
    renderSearch();
    await screen.findByRole('option', { name: 'Jeep' });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Jeep' } });
    await screen.findByRole('option', { name: 'Compass' });
    fireEvent.change(screen.getByLabelText('Modelo'), { target: { value: 'Compass' } });
    fireEvent.change(screen.getByLabelText('Marca'), { target: { value: 'Toyota' } });
    await screen.findByRole('option', { name: 'Corolla' });
    expect(screen.getByLabelText('Modelo')).toHaveValue('');
    expect(screen.queryByRole('option', { name: 'Compass' })).not.toBeInTheDocument();
  });

  it('permite buscar por preço quando a API falha', async () => {
    api.get.mockRejectedValue(new Error('offline'));
    renderSearch();
    await screen.findByText(/Não foi possível carregar as marcas/);
    expect(screen.getByLabelText('Marca')).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Faixa de preço'), { target: { value: 'under100' } });
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(screen.getByTestId('destination')).toHaveTextContent('/estoque?maxPrice=100000');
  });

  it('permite buscar todo o estoque sem filtros', async () => {
    renderSearch();
    await waitFor(() => expect(screen.getByLabelText('Marca')).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Buscar veículos' }));
    expect(screen.getByTestId('destination').textContent).toBe('/estoque');
  });

  it('obtém modelos de todas as páginas e remove duplicatas', async () => {
    api.get.mockResolvedValueOnce({ data: { content: [{ model: 'Compass' }], totalPages: 2 } }).mockResolvedValueOnce({ data: { content: [{ model: 'Renegade' }, { model: 'Compass' }], totalPages: 2 } });
    expect(await getBrandModels('Jeep', {})).toEqual(['Compass', 'Renegade']);
    expect(api.get).toHaveBeenLastCalledWith('/vehicles', expect.objectContaining({ params: { brand: 'Jeep', page: 1, size: 100 } }));
  });
});
