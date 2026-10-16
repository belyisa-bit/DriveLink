import { api } from '../lib/axios';
import { getCatalogVehicles } from '../features/catalog/catalogApi';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

it('reúne opções do mesmo modelo em páginas diferentes antes de agrupar', async () => {
  api.get.mockResolvedValueOnce({ data: { content: [{ id: 'a' }], totalPages: 2, totalElements: 2 } });
  api.get.mockResolvedValueOnce({ data: { content: [{ id: 'b' }], totalPages: 2, totalElements: 2 } });
  const controller = new AbortController();
  const result = await getCatalogVehicles({ brand: 'Fiat' }, { signal: controller.signal });
  expect(result.content).toEqual([{ id: 'a' }, { id: 'b' }]);
  expect(api.get).toHaveBeenLastCalledWith('/vehicles', { params: { brand: 'Fiat', page: 1 }, signal: controller.signal });
});
