import { api } from '../lib/axios';
import {
  getVehicleDetail,
  getVehicleVariants,
  getSimilarVehicles,
} from '../features/vehicle-detail/vehicleDetailsApi';
import { sendVehicleInterest } from '../features/vehicle-detail/vehicleLeadApi';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn(), post: vi.fn() } }));
beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
});

it('envia o lead com a unidade escolhida e a origem DETALHE_VEICULO', async () => {
  const values = {
    name: 'Maria Silva',
    phone: '11987654321',
    email: 'maria@example.com',
    contactPreference: 'WHATSAPP',
    message: '',
    lgpdConsent: true,
  };
  api.post.mockResolvedValue({ data: { id: 91 } });
  expect(await sendVehicleInterest({ id: 12 }, values)).toEqual({
    simulated: false,
    id: 91,
  });
  expect(api.post).toHaveBeenCalledWith('/leads', {
    ...values,
    vehicleId: 12,
    source: 'DETALHE_VEICULO',
  });
  await expect(
    sendVehicleInterest({ id: 'catalog-1' }, values),
  ).rejects.toThrow('Referência inválida');
  expect(api.post).toHaveBeenCalledTimes(1);
});

it('consulta o slug codificado e rejeita uma resposta sem referência de veículo', async () => {
  api.get.mockResolvedValueOnce({
    data: { id: 1, slug: 'fiat-argo', brand: 'Fiat', model: 'Argo' },
  });
  const signal = new AbortController().signal;
  expect(await getVehicleDetail('fiat/argo', { signal })).toMatchObject({
    id: 1,
  });
  expect(api.get).toHaveBeenCalledWith('/vehicles/fiat%2Fargo', { signal });
  api.get.mockResolvedValueOnce({ data: {} });
  await expect(getVehicleDetail('invalido')).rejects.toThrow(
    'Resposta inválida',
  );
});

it('reúne todas as páginas e usa as cores do detalhe apenas de unidades disponíveis do modelo', async () => {
  const car = (slug, extra = {}) => ({
    slug,
    brand: 'Fiat',
    model: 'Argo',
    year: 2024,
    status: 'DISPONIVEL',
    ...extra,
  });
  api.get.mockImplementation(async (url, { params } = {}) => {
    if (url === '/vehicles')
      return {
        data: {
          content: params.page
            ? [
                car('preto'),
                car('vendido', { status: 'VENDIDO' }),
                car('mobi', { model: 'Mobi' }),
              ]
            : [car('branco')],
          totalPages: 2,
        },
      };
    return {
      data: car(url.endsWith('branco') ? 'branco' : 'preto', {
        color: url.endsWith('branco') ? 'Branco' : 'Preto',
      }),
    };
  });
  const result = await getVehicleVariants('Fiat', 'Argo');
  expect(result.map((item) => item.color)).toEqual(['Branco', 'Preto']);
  expect(api.get).not.toHaveBeenCalledWith(
    '/vehicles/vendido',
    expect.anything(),
  );
  expect(api.get).not.toHaveBeenCalledWith('/vehicles/mobi', expect.anything());
});

it('exclui o carro atual, modelos repetidos e indisponíveis das sugestões', async () => {
  const vehicle = { slug: 'argo', brand: 'Fiat', model: 'Argo', price: 80000 };
  api.get.mockResolvedValueOnce({
    data: [
      { ...vehicle, status: 'DISPONIVEL' },
      { ...vehicle, slug: 'argo-outro', status: 'DISPONIVEL' },
      {
        brand: 'Fiat',
        model: 'Mobi',
        slug: 'mobi',
        status: 'DISPONIVEL',
        price: 70000,
      },
      {
        brand: 'Fiat',
        model: 'Mobi',
        slug: 'mobi-2',
        status: 'DISPONIVEL',
        price: 65000,
      },
      { brand: 'Fiat', model: 'Toro', slug: 'toro', status: 'VENDIDO' },
    ],
  });
  expect((await getSimilarVehicles(vehicle)).map((item) => item.slug)).toEqual([
    'mobi',
  ]);
  expect(api.get).toHaveBeenCalledWith(
    '/vehicles/argo/similar',
    expect.anything(),
  );
});

it('prioriza marca e carroceria, limita o preço e escolhe a unidade mais próxima de cada modelo', async () => {
  const vehicle = {
    slug: 'base',
    brand: 'Fiat',
    model: 'Base',
    bodyType: 'SUV',
    price: 100000,
  };
  const car = (slug, extra = {}) => ({
    slug,
    brand: 'Fiat',
    model: slug,
    bodyType: 'SUV',
    price: 100000,
    status: 'DISPONIVEL',
    ...extra,
  });
  api.get.mockResolvedValueOnce({
    data: [
      car('distante', { price: 125001 }),
      car('mobi', { bodyType: 'HATCHBACK', price: 100000 }),
      car('outro-suv', { brand: 'Jeep', price: 101000 }),
      car('toro-cara', { model: 'Toro', price: 110000 }),
      car('toro-proxima', { model: 'Toro', price: 99000 }),
      car('sem-relacao', { brand: 'Honda', bodyType: 'SEDAN' }),
      car('sem-preco', { price: null }),
      null,
    ],
  });
  expect((await getSimilarVehicles(vehicle)).map((item) => item.slug)).toEqual([
    'toro-proxima',
    'mobi',
    'outro-suv',
  ]);
});

it('não inventa sugestões sem preço e trata uma resposta inválida como erro', async () => {
  api.get.mockResolvedValueOnce({ data: [] });
  expect(await getSimilarVehicles({ slug: 'base' })).toEqual([]);
  api.get.mockResolvedValueOnce({ data: {} });
  await expect(
    getSimilarVehicles({ slug: 'base', price: 100000 }),
  ).rejects.toThrow('Resposta inválida');
});
