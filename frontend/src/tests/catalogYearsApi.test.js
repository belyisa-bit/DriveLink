import { api } from '../lib/axios';
import { getCatalogYears } from '../features/catalog/catalogApi';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

describe('Anos do estoque dinâmico', () => {
  it('usa todas as páginas e inclui somente anos disponíveis do modelo selecionado', async () => {
    const car = (year, status = 'DISPONIVEL', model = 'Corolla') => ({ brand: 'Toyota', model, year, status });
    api.get.mockResolvedValueOnce({ data: { content: [car(2021), car(2024, 'VENDIDO'), car(2025, 'RESERVADO')], totalPages: 2 } });
    api.get.mockResolvedValueOnce({ data: { content: [car(2023), car(2021), car(2022, 'DISPONIVEL', 'Hilux')], totalPages: 2 } });
    const signal = new AbortController().signal;
    expect(await getCatalogYears('Toyota', 'Corolla', { signal })).toEqual([2023, 2021]);
    expect(api.get).toHaveBeenLastCalledWith('/vehicles', { params: { brand: 'Toyota', model: 'Corolla', page: 1, size: 100 }, signal });
  });
});
