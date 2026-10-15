import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { VehicleDetailsPage } from '../pages/VehicleDetailsPage';
import {
  getVehicleDetail,
  getVehicleVariants,
  getSimilarVehicles,
} from '../features/vehicle-detail/vehicleDetailsApi';
import { mockCatalogVehicles } from '../features/catalog/mockCatalogVehicles';
import { mockFeaturedVehicles } from '../features/home/mockFeaturedVehicles';
import { formatBRL } from '../lib/formatters';

vi.mock('../features/vehicle-detail/vehicleDetailsApi', () => ({
  getVehicleDetail: vi.fn(),
  getVehicleVariants: vi.fn(),
  getSimilarVehicles: vi.fn(),
}));
const fixtures = [
  {
    id: 1,
    brand: 'Fiat',
    model: 'Argo',
    slug: 'argo-2024-branco',
    year: 2024,
    color: 'Branco',
    mileage: 10000,
    price: 80000,
    status: 'DISPONIVEL',
    fuel: 'FLEX',
    transmission: 'MANUAL',
    features: ['Ar-condicionado'],
    description: 'Unidade cadastrada para teste.',
    reviewed: true,
    mainImageUrl: 'argo-2024.webp',
  },
  {
    id: 2,
    brand: 'Fiat',
    model: 'Argo',
    slug: 'argo-2024-preto',
    year: 2024,
    color: 'Preto',
    mileage: 20000,
    price: 75000,
    status: 'DISPONIVEL',
    mainImageUrl: 'argo-2024-preto.webp',
  },
  {
    id: 3,
    brand: 'Fiat',
    model: 'Argo',
    slug: 'argo-2024-preto-2',
    year: 2024,
    color: 'Preto',
    mileage: 30000,
    price: 72000,
    status: 'DISPONIVEL',
    mainImageUrl: 'argo-2024-preto-2.webp',
  },
  {
    id: 4,
    brand: 'Fiat',
    model: 'Argo',
    slug: 'argo-2020-prata',
    year: 2020,
    color: 'Prata',
    mileage: 60000,
    price: 50000,
    status: 'DISPONIVEL',
    mainImageUrl: 'argo-2020.webp',
  },
];

function History() {
  const navigate = useNavigate();
  return (
    <>
      <p data-testid="path">{useLocation().pathname}</p>
      <button onClick={() => navigate(-1)}>Voltar no histórico</button>
    </>
  );
}
function renderPage(slug) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter
        initialEntries={[`/estoque/${slug}`]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/estoque/:slug" element={<VehicleDetailsPage />} />
        </Routes>
        <History />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  getVehicleDetail.mockReset();
  getVehicleVariants.mockReset();
  getSimilarVehicles.mockReset();
  getVehicleDetail.mockImplementation(async (slug) => {
    const vehicle = fixtures.find((item) => item.slug === slug);
    if (!vehicle) throw { response: { status: 404 } };
    return vehicle;
  });
  getVehicleVariants.mockResolvedValue(fixtures);
  getSimilarVehicles.mockResolvedValue([]);
});
afterEach(() => vi.restoreAllMocks());

it('mostra breadcrumb, resumo, selos, especificações e itens cadastrados', async () => {
  renderPage(fixtures[0].slug);
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Fiat Argo' }),
  ).toBeInTheDocument();
  const breadcrumb = screen.getByRole('navigation', {
    name: 'Navegação estrutural',
  });
  expect(
    within(breadcrumb).getByRole('link', { name: 'Início' }),
  ).toHaveAttribute('href', '/');
  expect(
    within(breadcrumb).getByRole('link', { name: 'Estoque' }),
  ).toHaveAttribute('href', '/estoque');
  expect(screen.getByText('Revisado')).toBeInTheDocument();
  expect(screen.queryByText('Com garantia')).not.toBeInTheDocument();
  const specs = screen.getByRole('table', {
    name: 'Especificações de Fiat Argo',
  });
  expect(within(specs).getByText('Flex')).toBeInTheDocument();
  expect(within(specs).getByText('Manual')).toBeInTheDocument();
  expect(screen.getByText('Ar-condicionado')).toBeInTheDocument();
});

it('troca ano, cor e quilometragem atualizando preço e URL, e restaura pelo histórico', async () => {
  renderPage(fixtures[0].slug);
  await screen.findByRole('option', { name: 'Preto' });
  expect(
    within(screen.getByLabelText('Ano disponível'))
      .getAllByRole('option')
      .map((option) => option.value),
  ).toEqual(['2024', '2020']);
  fireEvent.change(screen.getByLabelText('Cor disponível'), {
    target: { value: 'Preto' },
  });
  await waitFor(() =>
    expect(screen.getByLabelText('Quilometragem disponível')).toHaveValue(
      'argo-2024-preto',
    ),
  );
  fireEvent.change(screen.getByLabelText('Quilometragem disponível'), {
    target: { value: 'argo-2024-preto-2' },
  });
  expect(
    await screen.findByText(formatBRL(72000), { normalizer: (value) => value }),
  ).toBeInTheDocument();
  expect(screen.getByTestId('path')).toHaveTextContent(
    '/estoque/argo-2024-preto-2',
  );
  fireEvent.change(await screen.findByLabelText('Ano disponível'), {
    target: { value: '2020' },
  });
  await waitFor(() =>
    expect(screen.getByLabelText('Cor disponível')).toHaveValue('Prata'),
  );
  expect(
    within(screen.getByLabelText('Cor disponível')).queryByRole('option', {
      name: 'Preto',
    }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText(formatBRL(50000), { normalizer: (value) => value }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 1' }),
  ).toHaveAttribute('src', 'argo-2020.webp');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar no histórico' }));
  await waitFor(() =>
    expect(screen.getByLabelText('Quilometragem disponível')).toHaveValue(
      'argo-2024-preto-2',
    ),
  );
  expect(
    screen.getByText(formatBRL(72000), { normalizer: (value) => value }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 1' }),
  ).toHaveAttribute('src', 'argo-2024-preto-2.webp');
});

it('abre os links dos três destaques da Home com o preço original', async () => {
  getVehicleDetail.mockImplementation(async (slug) =>
    mockCatalogVehicles.find((item) => item.slug === slug),
  );
  getVehicleVariants.mockResolvedValue(mockCatalogVehicles);
  for (const vehicle of mockFeaturedVehicles) {
    const view = renderPage(vehicle.slug);
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: `${vehicle.brand} ${vehicle.model}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(formatBRL(vehicle.price), {
        normalizer: (value) => value,
      }),
    ).toBeInTheDocument();
    view.unmount();
  }
});

it('oferece retorno ao estoque em URLs inexistentes e nova tentativa em falha de rede', async () => {
  const first = renderPage('nao-existe');
  expect(
    await screen.findByRole('heading', { name: 'Veículo não encontrado' }),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: 'Voltar ao estoque' }),
  ).toHaveAttribute('href', '/estoque');
  first.unmount();
  getVehicleDetail.mockRejectedValueOnce(new Error('offline'));
  renderPage(fixtures[0].slug);
  fireEvent.click(
    await screen.findByRole('button', { name: 'Tentar novamente' }),
  );
  expect(
    await screen.findByRole('heading', { level: 1, name: 'Fiat Argo' }),
  ).toBeInTheDocument();
});
