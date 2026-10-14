import { api } from '../lib/axios';

vi.mock('../lib/axios', () => ({ api: { get: vi.fn() } }));

describe('Consulta dos destaques', () => {
  beforeEach(() => { api.get.mockReset(); vi.resetModules(); });
  afterEach(() => { vi.unstubAllEnvs(); });

  it('consulta a API em produção mesmo com a variável de demonstração ativa', async () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('VITE_USE_MOCK_FEATURED', 'true');
    const { getFeaturedVehicles } = await import('../features/home/featuredVehiclesApi');
    const controller = new AbortController();
    api.get.mockResolvedValue({ data: [{ id: 7 }] });
    expect(await getFeaturedVehicles({ signal: controller.signal })).toEqual([{ id: 7 }]);
    expect(api.get).toHaveBeenCalledWith('/vehicles/featured', { signal: controller.signal });
  });

  it('rejeita uma resposta fora do contrato para mostrar o estado de erro', async () => {
    vi.stubEnv('VITE_USE_MOCK_FEATURED', 'false');
    const { getFeaturedVehicles } = await import('../features/home/featuredVehiclesApi');
    api.get.mockResolvedValue({ data: { message: 'unexpected' } });
    await expect(getFeaturedVehicles({})).rejects.toThrow('Resposta inválida');
  });
});
