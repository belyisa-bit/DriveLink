
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CatalogFilters } from '../features/catalog/CatalogFilters';
import {
  suggestedBrands,
  suggestedModels,
  suggestedYears,
} from '../features/catalog/catalogSuggestions';

vi.mock('../features/catalog/catalogApi', () => ({
  getCatalogFilters: vi.fn(),
  getCatalogModels: vi.fn(),
  getCatalogYears: vi.fn(),
}));

import {
  getCatalogFilters,
  getCatalogModels,
  getCatalogYears,
} from '../features/catalog/catalogApi';


describe('Dependência dos filtros do catálogo', () => {
  beforeEach(() => {
    getCatalogFilters.mockResolvedValue({ brands: suggestedBrands(), minPrice: 0, maxPrice: 300000 });
    getCatalogModels.mockImplementation(async (brand) => suggestedModels(brand));
    getCatalogYears.mockImplementation(async (brand, model) => suggestedYears(brand, model));
  });

  it('limpa dependências e envia somente a combinação selecionada ao aplicar', async () => {
    const onApply = vi.fn();
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={client}><CatalogFilters applied={{}} onApply={onApply} onClear={vi.fn()} /></QueryClientProvider>);
    const brand = screen.getByLabelText('Marca');
    const model = screen.getByLabelText('Modelo');
    const year = screen.getByLabelText('Ano');
    expect(model).toBeDisabled();
    expect(year).toBeDisabled();
    await screen.findByRole('option', { name: 'Citroën' }); //linha de espera para o carregamento das marcas
    fireEvent.change(brand, { target: { value: 'Citroën' } });
    await screen.findByRole('option', { name: 'C3' });
    expect(within(model).queryByRole('option', { name: 'Onix' })).not.toBeInTheDocument();
    fireEvent.change(model, { target: { value: 'C3' } });
    await screen.findByRole('option', { name: '2025' });
    expect(within(year).queryByRole('option', { name: '2021' })).not.toBeInTheDocument();
    fireEvent.change(year, { target: { value: '2025' } });
    fireEvent.change(model, { target: { value: 'C4 Cactus' } });
    expect(year).toHaveValue('');
    await screen.findByRole('option', { name: '2024' });
    fireEvent.change(year, { target: { value: '2024' } });
    fireEvent.change(brand, { target: { value: 'Jeep' } });
    expect(model).toHaveValue('');
    expect(year).toHaveValue('');
    await screen.findByRole('option', { name: 'Commander' });
    fireEvent.change(model, { target: { value: 'Commander' } });
    await screen.findByRole('option', { name: '2023' });
    expect(within(year).getAllByRole('option').map((option) => option.textContent)).toEqual(['Todos', '2025', '2024', '2023', '2022']);
    fireEvent.change(year, { target: { value: '2023' } });
    expect(onApply).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Aplicar filtros' })).toBeEnabled());
    fireEvent.click(screen.getByRole('button', { name: 'Aplicar filtros' }));
    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ brand: 'Jeep', model: 'Commander', minYear: '2023', maxYear: '2023' }));
    expect(within(brand).getByRole('option', { name: 'Todos' })).toBeInTheDocument();
    expect(within(model).getByRole('option', { name: 'Todos' })).toBeInTheDocument();
  });
});
