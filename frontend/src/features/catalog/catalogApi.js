import { api } from '../../lib/axios';

export const usingMockCatalog = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_CATALOG === 'true';

export function catalogParams(searchParams) {
  const params = {};
  for (const key of ['search', 'brand', 'model', 'minPrice', 'maxPrice', 'minYear', 'maxYear']) {
    const value = searchParams.get(key)?.trim();
    if (value) params[key] = value;
  }
  return params;
}

export async function getCatalogVehicles(params, { signal }) {
  if (usingMockCatalog) {
    const { searchMockCatalog } = await import('./mockCatalog');
    return searchMockCatalog(params);
  }
  const { data } = await api.get('/vehicles', { params, signal });
  if (!Array.isArray(data?.content)) throw new Error('Resposta inválida ao consultar o estoque.');
  return data;
}
