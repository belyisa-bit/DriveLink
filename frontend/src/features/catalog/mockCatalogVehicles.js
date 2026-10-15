import { catalogSuggestions } from './catalogSuggestions';
import { mockFeaturedVehicles } from '../home/mockFeaturedVehicles';
import { catalogImages } from './catalogImages';

// Valores exclusivamente fictícios, usados para testar todas as faixas de preço.
// A base é do ano mais recente de cada modelo na lista fornecida.
const latestYearPrices = {
  Chevrolet: { Onix: 89900, Tracker: 144900 },
  Citroën: { C3: 74900, 'C4 Cactus': 119900, Aircross: 129900 },
  Fiat: { Argo: 82900, Mobi: 67900, Strada: 119900, Toro: 189900 },
  Ford: { Ka: 72900, Fiesta: 64900, EcoSport: 97900, Ranger: 289900 },
  Honda: { Civic: 139900, Fit: 95900, City: 119900, 'HR-V': 169900 },
  Hyundai: { HB20: 79900, HB20S: 89900, Creta: 159900, Tucson: 84900 },
  Jeep: { Renegade: 139900, Compass: 209900, Commander: 289900 },
  Nissan: { Versa: 109900, Sentra: 159900, Kicks: 139900, Frontier: 279900 },
  Peugeot: { 208: 89900, 2008: 139900, 308: 79900 },
  Renault: { Kwid: 64900, Sandero: 79900, Logan: 79900, Duster: 129900 },
  Toyota: { Corolla: 169900, 'Corolla Cross': 199900, Yaris: 119900, Hilux: 309900 },
  Volkswagen: { Gol: 74900, Polo: 99900, Virtus: 119900, Nivus: 139900, 'T-Cross': 159900 },
};

const slugify = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const mockCatalogVehicles = [];
let sequence = 0;
for (const [brand, models] of Object.entries(catalogSuggestions)) {
  for (const [model, years] of Object.entries(models)) {
    const latestYear = Math.max(...years);
    for (const year of years) {
      sequence += 1;
      const example = mockFeaturedVehicles.find((vehicle) => vehicle.brand === brand && vehicle.model === model && vehicle.year === year);
      const image = catalogImages[`${brand} ${model}`] || null;
      const estimatedPrice = latestYearPrices[brand][model] * Math.max(0.4, 1 - (latestYear - year) * 0.055);
      mockCatalogVehicles.push({
        id: `catalog-${sequence}`,
        brand,
        model,
        year,
        color: ['Branco', 'Prata', 'Preto', 'Cinza'][sequence % 4],
        slug: example?.slug || slugify(`${brand}-${model}-${year}`),
        price: example?.price ?? Math.round(estimatedPrice / 1000) * 1000 + 900,
        mileage: example?.mileage ?? (2026 - year) * 11000 + (sequence % 5) * 1700,
        mainImageUrl: image,
        featured: Boolean(example),
        status: 'DISPONIVEL',
        createdAt: new Date(Date.UTC(2026, 0, 1) + sequence * 8 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
}
