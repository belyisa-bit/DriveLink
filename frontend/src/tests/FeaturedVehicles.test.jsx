import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { FeaturedVehicles } from '../features/home/FeaturedVehicles';
import { getFeaturedVehicles } from '../features/home/featuredVehiclesApi';

vi.mock('../features/home/featuredVehiclesApi', () => ({ getFeaturedVehicles: vi.fn(), usingMockFeatured: false }));

function vehicle(id, overrides = {}) {
  return { id, brand: 'Toyota', model: `Corolla ${id}`, slug: `corolla-${id}`, year: 2022, mileage: 38000, price: 142900, mainImageUrl: '/car.png', featured: true, status: 'DISPONIVEL', ...overrides };
}

function renderFeatured() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={client}><MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><FeaturedVehicles /></MemoryRouter></QueryClientProvider>);
}

describe('Veículos em destaque', () => {
  beforeEach(() => { getFeaturedVehicles.mockReset(); });

  it('exibe no máximo três veículos disponíveis e marcados como destaque', async () => {
    getFeaturedVehicles.mockResolvedValue([vehicle(0, { featured: false }), vehicle(1, { status: 'VENDIDO' }), vehicle(2), vehicle(3), vehicle(4), vehicle(5)]);
    renderFeatured();
    await screen.findByRole('heading', { name: 'Toyota Corolla 2' });
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(screen.queryByRole('heading', { name: 'Toyota Corolla 0' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Toyota Corolla 1' })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Toyota Corolla 5' })).not.toBeInTheDocument();
    expect(screen.getAllByText(/38\.000 km/)).toHaveLength(3);
    expect(screen.getAllByText(/R\$\s142\.900,00/)).toHaveLength(3);
    expect(screen.getByRole('link', { name: 'Ver detalhes de Toyota Corolla 2' })).toHaveAttribute('href', '/estoque/corolla-2');
    expect(screen.getByRole('link', { name: 'Ver todo o estoque' })).toHaveAttribute('href', '/estoque');
    expect(getFeaturedVehicles).toHaveBeenCalled();
  });

  it('informa o estado de carregamento', () => {
    getFeaturedVehicles.mockReturnValue(new Promise(() => {}));
    renderFeatured();
    expect(screen.getByRole('status', { name: 'Carregando veículos em destaque' })).toBeInTheDocument();
  });

  it('informa quando não há destaques', async () => {
    getFeaturedVehicles.mockResolvedValue([]);
    renderFeatured();
    expect(await screen.findByText(/Nenhum veículo em destaque/)).toBeInTheDocument();
  });

  it('permite tentar novamente após uma falha', async () => {
    getFeaturedVehicles.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([vehicle(1)]);
    renderFeatured();
    fireEvent.click(await screen.findByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'Toyota Corolla 1' })).toBeInTheDocument();
  });

  it('mostra alternativa quando a imagem falha', async () => {
    getFeaturedVehicles.mockResolvedValue([vehicle(1)]);
    renderFeatured();
    fireEvent.error(await screen.findByRole('img', { name: 'Toyota Corolla 1' }));
    expect(screen.getByText('Imagem indisponível')).toBeInTheDocument();
  });
});
