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

export async function getSimilarVehicles(vehicle, { signal } = {}) {
  let candidates;
  if (usingMockCatalog) {
    const { mockVehicleDetails } = await import('./mockVehicleDetails');
    candidates = mockVehicleDetails;
  } else {
    const { data } = await api.get(
      `/vehicles/${encodeURIComponent(vehicle.slug)}/similar`,
      { signal },
    );
    if (!Array.isArray(data))
      throw new Error('Resposta inválida ao carregar veículos similares.');
    candidates = data;
  }
  const basePrice = Number(vehicle.price);
  if (!Number.isFinite(basePrice) || basePrice <= 0) return [];
  const sameBody = (item) =>
    Boolean(vehicle.bodyType && item.bodyType === vehicle.bodyType);
  const relevance = (item) =>
    Number(item.brand === vehicle.brand) + Number(sameBody(item));
  const models = new Set();
  return candidates
    .filter(
      (item) =>
        item &&
        item.slug &&
        item.brand &&
        item.model &&
        item.status === 'DISPONIVEL' &&
        item.slug !== vehicle.slug &&
        !(item.brand === vehicle.brand && item.model === vehicle.model) &&
        relevance(item) > 0 &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) > 0 &&
        Math.abs(Number(item.price) - basePrice) <= basePrice * 0.25,
    )
    .sort(
      (a, b) =>
        relevance(b) - relevance(a) ||
        Math.abs(Number(a.price) - basePrice) -
          Math.abs(Number(b.price) - basePrice) ||
        (b.year || 0) - (a.year || 0) ||
        a.slug.localeCompare(b.slug),
    )
    .filter((item) => {
      const key = JSON.stringify([item.brand, item.model]);
      if (models.has(key)) return false;
      models.add(key);
      return true;
    })
    .slice(0, 3);
}
