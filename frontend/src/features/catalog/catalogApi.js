import { api } from '../../lib/axios';

export const usingMockCatalog = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_CATALOG === 'true';

export async function getCatalogFilters({ signal }) {
  if (usingMockCatalog) {
    const { mockCatalogFilters } = await import('./mockCatalog');
    return mockCatalogFilters();
  }
  const { data } = await api.get('/vehicles/filters', { signal });
  if (!Array.isArray(data?.brands)) throw new Error('Resposta inválida ao carregar os filtros.');
  return data;
}

export async function getCatalogModels(brand, { signal }) {
  if (usingMockCatalog) {
    const { mockCatalogModels } = await import('./mockCatalog');
    return mockCatalogModels(brand);
  }
  const models = new Set();
  let page = 0;
  let totalPages = 1;
  do {
    const { data } = await api.get('/vehicles', { params: { brand, page, size: 100 }, signal });
    if (!Array.isArray(data?.content)) throw new Error('Resposta inválida ao carregar os modelos.');
    data.content.forEach((vehicle) => { if (vehicle.model) models.add(vehicle.model); });
    totalPages = data.totalPages;
    page += 1;
  } while (page < totalPages);
  return [...models].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export async function getCatalogYears(brand, model, { signal }) {
  if (usingMockCatalog) {
    const { suggestedYears } = await import('./catalogSuggestions');
    return suggestedYears(brand, model);
  }
  const years = new Set();
  let page = 0;
  let totalPages = 1;
  do {
    const { data } = await api.get('/vehicles', { params: { brand, model, page, size: 100 }, signal });
    if (!Array.isArray(data?.content)) throw new Error('Resposta inválida ao carregar os anos.');
    for (const vehicle of data.content) {
      if (vehicle.status === 'DISPONIVEL' && vehicle.brand === brand && vehicle.model === model && Number.isInteger(vehicle.year)) years.add(vehicle.year);
    }
    totalPages = data.totalPages;
    page += 1;
  } while (page < totalPages);
  return [...years].sort((a, b) => b - a);
}

export async function getCatalogVehicles(params, { signal }) {
  if (usingMockCatalog) {
    const { searchMockCatalog } = await import('./mockCatalog');
    return searchMockCatalog(params);
  }
  const { data } = await api.get('/vehicles', { params, signal });
  if (!Array.isArray(data?.content)) throw new Error('Resposta inválida ao consultar o estoque.');
  // Todas as unidades são necessárias para não separar um modelo entre páginas.
  const content = [...data.content];
  for (let page = 1; page < data.totalPages; page += 1) {
    const response = await api.get('/vehicles', { params: { ...params, page }, signal });
    if (!Array.isArray(response.data?.content)) throw new Error('Resposta inválida ao consultar o estoque.');
    content.push(...response.data.content);
  }
  return { ...data, content };
}
