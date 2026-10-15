import { fireEvent, render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { SimilarVehicles } from '../features/vehicle/SimilarVehicles';
import { getSimilarVehicles } from '../features/vehicle/vehicleDetailsApi';

vi.mock('../features/vehicle/vehicleDetailsApi', () => ({
  getSimilarVehicles: vi.fn(),
}));
beforeEach(() => {
  getSimilarVehicles.mockReset();
});
const vehicle = {
  slug: 'fiat-argo',
  brand: 'Fiat',
  model: 'Argo',
  price: 80000,
};
function show() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <SimilarVehicles vehicle={vehicle} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

it('mostra carregamento enquanto consulta as sugestões', () => {
  getSimilarVehicles.mockReturnValue(new Promise(() => {}));
  show();
  expect(
    screen.getByRole('status', { name: 'Carregando veículos similares' }),
  ).toBeInTheDocument();
});

it('permite tentar novamente e abre os detalhes da sugestão retornada', async () => {
  getSimilarVehicles.mockRejectedValueOnce(new Error('offline'));
  getSimilarVehicles.mockResolvedValueOnce([
    {
      slug: 'fiat-mobi-2024',
      brand: 'Fiat',
      model: 'Mobi',
      price: 70000,
      year: 2024,
      mileage: 12000,
    },
  ]);
  show();
  fireEvent.click(
    await screen.findByRole('button', { name: 'Tentar carregar sugestões' }),
  );
  expect(
    await screen.findByRole('link', { name: 'Ver detalhes de Fiat Mobi' }),
  ).toHaveAttribute('href', '/estoque/fiat-mobi-2024');
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

it('mostra estado vazio com acesso ao estoque quando não há sugestões compatíveis', async () => {
  getSimilarVehicles.mockResolvedValueOnce([]);
  show();
  expect(
    await screen.findByText(/Não há sugestões semelhantes no momento/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Ver todo o estoque' }),
  ).toHaveAttribute('href', '/estoque');
  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});
