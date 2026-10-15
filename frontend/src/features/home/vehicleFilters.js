import { api } from '../../lib/axios';

export const usingMockFilters = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_FILTERS === 'true';

export async function getVehicleFilters({ signal }) {
  if (usingMockFilters) {
    const { mockVehicleFilters } = await import('./mockFilters');
    return mockVehicleFilters();
  }
  const { data } = await api.get('/vehicles/filters', { signal });
  return data;
}

export async function getBrandModels(brand, { signal }) {
  if (usingMockFilters) {
    const { mockBrandModels } = await import('./mockFilters');
    return mockBrandModels(brand);
  }
  const models = new Set();
  let page = 0;
  let totalPages = 1;

  do {
    const { data } = await api.get('/vehicles', { params: { brand, page, size: 100 }, signal });
    for (const vehicle of data.content) {
      if (vehicle.model) models.add(vehicle.model);
    }
    totalPages = data.totalPages;
    page += 1;
  } while (page < totalPages);

  return [...models].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
