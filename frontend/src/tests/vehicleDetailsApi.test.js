import { api } from '../lib/axios';
import {
  getVehicleDetail,
  getVehicleVariants,
} from '../features/vehicle-detail/vehicleDetailsApi';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn(), post: vi.fn() } }));
beforeEach(() => {
  api.get.mockReset();
  api.post.mockReset();
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
