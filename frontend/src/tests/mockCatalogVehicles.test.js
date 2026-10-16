import { catalogSuggestions } from '../features/catalog/catalogSuggestions';
import { mockCatalogVehicles } from '../features/catalog/mockCatalogVehicles';
import { mockFeaturedVehicles } from '../features/home/mockFeaturedVehicles';
import { searchMockCatalog } from '../features/catalog/mockCatalog';
import { priceRanges } from '../lib/vehicleSearchOptions';
import { getCatalogPhoto } from '../features/catalog/catalogPhotos';
import photoData from '../features/catalog/catalogPhotoData.json';

describe('Estoque de exemplo completo', () => {
  it('mantém as cores das unidades coerentes com a foto de cada modelo', () => {
    for (const vehicle of mockCatalogVehicles) {
      const photo = getCatalogPhoto(vehicle.brand, vehicle.model, vehicle.year);
      expect(photo).not.toBeNull();
      expect(vehicle.mainImageUrl).toBe(photo.url);
      expect(vehicle.color).toBe(photo.color);
      expect(vehicle.imageCredit.sourceUrl).toBe(photo.sourceUrl);
      expect(
        photoData.filter(
          (item) =>
            item.brand === vehicle.brand &&
            item.model === vehicle.model &&
            vehicle.year >= item.minYear &&
            vehicle.year <= item.maxYear,
        ),
      ).toHaveLength(1);
    }
    expect(getCatalogPhoto('Fiat', 'Argo', 2018).color).toBe('Vermelho');
    expect(getCatalogPhoto('Fiat', 'Argo', 2024).color).toBe('Prata');
  });

  it('separa gerações e reestilizações e não reaproveita uma foto para anos sem cadastro', () => {
    for (const [brand, model, older, newer] of [
      ['Honda', 'Civic', 2015, 2017],
      ['Toyota', 'Corolla', 2019, 2020],
      ['Honda', 'HR-V', 2022, 2023],
      ['Fiat', 'Strada', 2020, 2021],
      ['Hyundai', 'HB20', 2019, 2020],
      ['Hyundai', 'HB20', 2022, 2023],
      ['Volkswagen', 'Nivus', 2024, 2025],
    ]) {
      expect(getCatalogPhoto(brand, model, older).url).not.toBe(
        getCatalogPhoto(brand, model, newer).url,
      );
    }
    expect(getCatalogPhoto('Toyota', 'Corolla', 2014)).toBeNull();
    expect(getCatalogPhoto('Toyota', 'Corolla', 2026)).toBeNull();
    expect(getCatalogPhoto('Marca inexistente', 'Modelo', 2020)).toBeNull();
  });

  it('cadastra uma única vez cada combinação de marca, modelo e ano fornecida', () => {
    const expected = Object.entries(catalogSuggestions).flatMap(
      ([brand, models]) =>
        Object.entries(models).flatMap(([model, years]) =>
          years.map((year) => `${brand}|${model}|${year}`),
        ),
    );
    const actual = mockCatalogVehicles.map(
      (vehicle) => `${vehicle.brand}|${vehicle.model}|${vehicle.year}`,
    );
    expect(actual.sort()).toEqual(expected.sort());
    expect(new Set(actual).size).toBe(actual.length);
    expect(
      new Set(mockCatalogVehicles.map((vehicle) => vehicle.slug)).size,
    ).toBe(actual.length);
    expect(
      mockCatalogVehicles.every(
        (vehicle) =>
          vehicle.price > 0 &&
          Number.isFinite(vehicle.price) &&
          vehicle.mileage >= 0,
      ),
    ).toBe(true);
    expect(
      mockCatalogVehicles.every(
        (vehicle) => vehicle.mainImageUrl && vehicle.color,
      ),
    ).toBe(true);
  });

  it('oferece resultados em todas as faixas de preço e filtra anos antigos', () => {
    for (const range of priceRanges.filter((range) => range.value)) {
      const result = searchMockCatalog({
        minPrice: range.minPrice,
        maxPrice: range.maxPrice,
      });
      expect(result.totalElements).toBeGreaterThan(0);
      expect(
        result.content.every(
          (vehicle) =>
            (!range.minPrice || vehicle.price >= Number(range.minPrice)) &&
            (!range.maxPrice || vehicle.price <= Number(range.maxPrice)),
        ),
      ).toBe(true);
    }
    const gol = searchMockCatalog({
      brand: 'Volkswagen',
      model: 'Gol',
      minYear: '2012',
      maxYear: '2012',
    });
    expect(gol.content).toHaveLength(1);
    expect(gol.content[0].year).toBe(2012);
    expect(
      searchMockCatalog({
        brand: 'Volkswagen',
        model: 'Gol',
        minYear: '2013',
        maxYear: '2013',
      }).totalElements,
    ).toBe(0);
  });

  it('ordena a coleção inteira sem alterar os destaques da Home', () => {
    const ordered = searchMockCatalog({ sortBy: 'price_asc' }).content;
    expect(
      ordered.every(
        (vehicle, index) =>
          index === 0 || vehicle.price >= ordered[index - 1].price,
      ),
    ).toBe(true);
    expect(mockFeaturedVehicles).toHaveLength(3);
    for (const featured of mockFeaturedVehicles) {
      const equivalent = mockCatalogVehicles.find(
        (vehicle) => vehicle.slug === featured.slug,
      );
      expect(equivalent).toMatchObject({
        price: featured.price,
        mileage: featured.mileage,
        mainImageUrl: featured.mainImageUrl,
      });
    }
  });
});
