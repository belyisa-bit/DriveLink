import { api } from '../../lib/axios';

export const usingMockFeatured = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_FEATURED === 'true';

export async function getFeaturedVehicles({ signal }) {
  if (usingMockFeatured) {
    const { mockFeaturedVehicles } = await import('./mockFeaturedVehicles');
    return mockFeaturedVehicles;
  }
  const { data } = await api.get('/vehicles/featured', { signal });
  if (!Array.isArray(data)) throw new Error('Resposta inválida ao carregar veículos em destaque.');
  return data;
}
