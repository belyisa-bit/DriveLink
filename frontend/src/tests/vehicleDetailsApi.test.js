import { api } from '../lib/axios';
import {
  getVehicleDetail,
  getVehicleVariants,
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
