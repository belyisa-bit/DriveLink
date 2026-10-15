import { api } from '../../lib/axios';
import { getCatalogVehicles, usingMockCatalog } from '../catalog/catalogApi';

export async function getVehicleDetail(slug, { signal } = {}) {
  if (usingMockCatalog) {
    const { mockVehicleDetails } = await import('./mockVehicleDetails');
    const vehicle = mockVehicleDetails.find((item) => item.slug === slug);
    if (!vehicle) {
      const error = new Error('Veículo não encontrado.');
      error.response = { status: 404 };
      throw error;
    }
    return vehicle;
  }
  const { data } = await api.get(`/vehicles/${encodeURIComponent(slug)}`, {
    signal,
  });
  if (!data?.slug || !data.brand || !data.model)
    throw new Error('Resposta inválida ao carregar o veículo.');
  return data;
}

export async function getVehicleVariants(brand, model, { signal } = {}) {
  if (usingMockCatalog) {
    const { mockVehicleDetails } = await import('./mockVehicleDetails');
    return mockVehicleDetails.filter(
      (item) =>
        item.brand === brand &&
        item.model === model &&
        item.status === 'DISPONIVEL',
    );
  }
  const { content } = await getCatalogVehicles({ brand, model }, { signal });
  const summaries = content.filter(
    (item) =>
      item.brand === brand &&
      item.model === model &&
      item.status === 'DISPONIVEL',
  );
  // A cor não vem no resumo da API atual; consultar as unidades para não inventar opções.
  const details = await Promise.all(
    summaries.map((item) => getVehicleDetail(item.slug, { signal })),
  );
  return details.filter(
    (item) =>
      item.brand === brand &&
      item.model === model &&
      item.status === 'DISPONIVEL',
  );
}
