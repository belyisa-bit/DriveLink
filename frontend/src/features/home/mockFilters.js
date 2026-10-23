// Os filtros da busca rápida precisam refletir o mesmo catálogo fictício do estoque.
import { suggestedBrands, suggestedModels } from '../catalog/catalogSuggestions';

export function mockVehicleFilters() {
  return { brands: suggestedBrands() };
}

export function mockBrandModels(brand) {
  return suggestedModels(brand);
}
