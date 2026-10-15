import { mockFeaturedVehicles } from '../home/mockFeaturedVehicles';
import { suggestedBrands, suggestedModels } from './catalogSuggestions';

const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function searchMockCatalog(params) {
  const content = mockFeaturedVehicles.filter((vehicle) => {
    const text = normalize(`${vehicle.brand} ${vehicle.model} ${vehicle.version || ''}`);
    return vehicle.status === 'DISPONIVEL'
      && (!params.search || text.includes(normalize(params.search)))
      && (!params.brand || normalize(vehicle.brand) === normalize(params.brand))
      && (!params.model || normalize(vehicle.model) === normalize(params.model))
      && (!params.minPrice || vehicle.price >= Number(params.minPrice))
      && (!params.maxPrice || vehicle.price <= Number(params.maxPrice))
      && (!params.minYear || vehicle.year >= Number(params.minYear))
      && (!params.maxYear || vehicle.year <= Number(params.maxYear));
  });
  return { content, totalElements: content.length, totalPages: content.length ? 1 : 0, number: 0 };
}

export function mockCatalogFilters() {
  const vehicles = mockFeaturedVehicles.filter((vehicle) => vehicle.status === 'DISPONIVEL');
  return {
    brands: suggestedBrands(),
    years: [...new Set(vehicles.map((vehicle) => vehicle.year))],
    minPrice: vehicles.length ? Math.min(...vehicles.map((vehicle) => vehicle.price)) : null,
    maxPrice: vehicles.length ? Math.max(...vehicles.map((vehicle) => vehicle.price)) : null,
  };
}

export function mockCatalogModels(brand) {
  return suggestedModels(brand);
}
