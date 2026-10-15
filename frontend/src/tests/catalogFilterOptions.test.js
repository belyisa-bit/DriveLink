import { mockVehicleFilters, mockBrandModels } from '../features/home/mockFilters';
import { mockCatalogFilters, mockCatalogModels } from '../features/catalog/mockCatalog';
import { suggestedYears } from '../features/catalog/catalogSuggestions';
import { availablePriceRanges } from '../features/catalog/filterOptions';
import { priceRanges } from '../lib/vehicleSearchOptions';

describe('Consistência dos filtros da Home e do estoque', () => {
  it('mantém só marcas e modelos presentes também na Home', () => {
    const brands = mockVehicleFilters().brands;
    expect(mockCatalogFilters().brands).toEqual(brands);
    for (const brand of brands) {
      for (const model of mockCatalogModels(brand)) expect(mockBrandModels(brand)).toContain(model);
    }
    expect(mockCatalogModels('Chevrolet')).toEqual(['Onix', 'Tracker']);
    expect(mockCatalogModels('Volkswagen')).not.toContain('Tera');
  });

  it('preserva lacunas da lista fornecida e ordena os anos do mais recente ao antigo', () => {
    expect(suggestedYears('Citroën', 'C3')).toEqual([2025, 2024, 2023, 2020, 2019, 2018, 2017, 2016]);
    expect(suggestedYears('Volkswagen', 'Gol')).toEqual([2022, 2021, 2020, 2019, 2018, 2016, 2014, 2012]);
    expect(suggestedYears('Jeep', 'Commander')).toEqual([2025, 2024, 2023, 2022]);
    expect(suggestedYears('Toyota', 'inexistente')).toEqual([]);
  });

  it('compartilha as faixas de preço e seus limites', () => {
    const catalog = availablePriceRanges({ minPrice: 0, maxPrice: 300000 });
    expect(catalog.map((range) => range.label)).toEqual(priceRanges.filter((range) => range.value).map((range) => range.label));
    expect(catalog.at(-1).value).toBe('150000.01:');
  });
});
