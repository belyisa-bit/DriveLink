import { mockCatalogVehicles } from '../features/catalog/mockCatalogVehicles';
import { catalogSuggestions } from '../features/catalog/catalogSuggestions';

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock('../lib/axios', () => ({ api }));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

it('mantém o teste do formulário local sem enviar dados ou IDs fictícios ao backend', async () => {
  vi.stubEnv('VITE_USE_MOCK_CATALOG', 'true');
  vi.resetModules();
  const { sendVehicleInterest } =
    await import('../features/vehicle-detail/vehicleLeadApi');
  expect(await sendVehicleInterest(mockCatalogVehicles[0], {})).toEqual({
    simulated: true,
  });
  expect(api.post).not.toHaveBeenCalled();
});

it('resolve os 362 veículos e as opções dos 44 modelos sem alterar o estoque nem chamar a API', async () => {
  vi.stubEnv('VITE_USE_MOCK_CATALOG', 'true');
  vi.resetModules();
  const { getVehicleDetail, getVehicleVariants } =
    await import('../features/vehicle-detail/vehicleDetailsApi');
  for (const vehicle of mockCatalogVehicles) {
    const detail = await getVehicleDetail(vehicle.slug);
    expect(detail).toMatchObject({
      slug: vehicle.slug,
      year: vehicle.year,
      color: vehicle.color,
      mileage: vehicle.mileage,
      price: vehicle.price,
      mainImageUrl: vehicle.mainImageUrl,
    });
    expect(detail.images[0].url).toBe(vehicle.mainImageUrl);
  }
  for (const [brand, models] of Object.entries(catalogSuggestions)) {
    for (const [model, years] of Object.entries(models)) {
      const variants = await getVehicleVariants(brand, model);
      expect(variants).toHaveLength(years.length);
    }
  }
  await expect(getVehicleDetail('nao-existe')).rejects.toMatchObject({
    response: { status: 404 },
  });
  expect(api.get).not.toHaveBeenCalled();
});
