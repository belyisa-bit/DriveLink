import { getCatalogTransmission } from '../features/catalog/catalogTransmissions';
import { mockCatalogVehicles } from '../features/catalog/mockCatalogVehicles';

it('preenche apenas as faixas confirmadas e respeita mudanças de oferta entre anos', () => {
  expect(getCatalogTransmission('Fiat', 'Strada', 2021)).toBe('MANUAL');
  expect(getCatalogTransmission('Fiat', 'Strada', 2022)).toBeNull();
  expect(getCatalogTransmission('Nissan', 'Sentra', 2016)).toBeNull();
  expect(getCatalogTransmission('Nissan', 'Sentra', 2017)).toBe('CVT');
  expect(getCatalogTransmission('Jeep', 'Compass', 2023)).toBe('AUTOMATICO');
  expect(getCatalogTransmission('Toyota', 'Corolla', 2022)).toBe('CVT');
  expect(getCatalogTransmission('Toyota', 'Yaris', 2022)).toBeNull();
  expect(getCatalogTransmission('Toyota', 'Yaris', 2023)).toBe('CVT');
});

it('não deduz câmbio em modelos com versões diferentes, dados inválidos ou anos futuros', () => {
  for (const [brand, model, year] of [
    ['Fiat', 'Argo', 2018],
    ['Chevrolet', 'Onix', 2023],
    ['Nissan', 'Versa', 2021],
    ['Toyota', 'Corolla', 2026],
    ['Outra marca', 'Corolla', 2022],
    ['Toyota', 'Corolla', null],
  ])
    expect(getCatalogTransmission(brand, model, year)).toBeNull();
  const known = mockCatalogVehicles.filter((vehicle) => vehicle.transmission);
  expect(known.length).toBeGreaterThan(0);
  expect(
    known.every((vehicle) =>
      ['MANUAL', 'AUTOMATICO', 'CVT'].includes(vehicle.transmission),
    ),
  ).toBe(true);
  expect(
    mockCatalogVehicles.find(
      (vehicle) =>
        vehicle.brand === 'Fiat' &&
        vehicle.model === 'Strada' &&
        vehicle.year === 2021,
    ).transmission,
  ).toBe('MANUAL');
  expect(
    mockCatalogVehicles.find(
      (vehicle) =>
        vehicle.brand === 'Fiat' &&
        vehicle.model === 'Argo' &&
        vehicle.year === 2018,
    ).transmission,
  ).toBeNull();
});
