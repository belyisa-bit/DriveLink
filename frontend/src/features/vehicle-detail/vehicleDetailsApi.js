import { api } from '../../lib/axios';
import { usingMockCatalog } from '../catalog/catalogApi';

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
