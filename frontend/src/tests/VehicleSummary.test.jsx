import { render, screen, within } from '@testing-library/react';
import { VehicleSummary } from '../features/vehicle/VehicleSummary';
import { formatBRL } from '../lib/formatters';

const vehicle = {
  brand: 'Honda',
  model: 'Civic',
  version: 'EXL 2.0',
  year: 2021,
  mileage: 38000,
  price: 139900,
  fuel: 'FLEX',
  transmission: 'AUTOMATICO',
  status: 'DISPONIVEL',
  reviewed: true,
  singleOwner: true,
};

it('mostra a versão no título, o preço e os quatro dados do resumo', () => {
  const view = render(<VehicleSummary vehicle={vehicle} />);
  expect(
    screen.getByRole('heading', { level: 1, name: 'Honda Civic EXL 2.0' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(formatBRL(vehicle.price), {
      normalizer: (value) => value,
    }),
  ).toHaveAttribute('aria-live', 'polite');
  for (const [label, value] of [
    ['Ano', '2021'],
    ['Quilometragem', '38.000 km'],
    ['Combustível', 'Flex'],
    ['Câmbio', 'Automático'],
  ]) {
    expect(
      within(screen.getByText(label).parentElement).getByText(value),
    ).toBeInTheDocument();
  }
  expect(screen.getByText('Único dono')).toBeInTheDocument();
  expect(screen.getByText('Revisado')).toBeInTheDocument();
  expect(screen.getByText('Disponível')).toBeInTheDocument();
  view.rerender(
    <VehicleSummary
      vehicle={{
        ...vehicle,
        year: 2020,
        mileage: 50000,
        price: 120900,
        fuel: 'GASOLINA',
        transmission: 'MANUAL',
        singleOwner: false,
        reviewed: false,
      }}
    />,
  );
  expect(screen.getByText('2020')).toBeInTheDocument();
  expect(screen.getByText('50.000 km')).toBeInTheDocument();
  expect(screen.getByText('Gasolina')).toBeInTheDocument();
  expect(screen.getByText('Manual')).toBeInTheDocument();
  expect(screen.queryByText('Único dono')).not.toBeInTheDocument();
  expect(screen.queryByText('Revisado')).not.toBeInTheDocument();
});

it('indica dados ausentes e só exibe selos confirmados para a unidade', () => {
  render(
    <VehicleSummary
      vehicle={{
        brand: 'Fiat',
        model: 'Argo',
        reviewed: 'true',
        singleOwner: null,
        hasWarranty: false,
        status: 'VENDIDO',
      }}
    />,
  );
  expect(
    screen.getByRole('heading', { level: 1, name: 'Fiat Argo' }),
  ).toBeInTheDocument();
  expect(screen.getByText('Indisponível')).toBeInTheDocument();
  expect(screen.queryByText('Combustível')).not.toBeInTheDocument();
  expect(screen.queryByText('Câmbio')).not.toBeInTheDocument();
  expect(screen.queryByText('Revisado')).not.toBeInTheDocument();
  expect(screen.queryByText('Único dono')).not.toBeInTheDocument();
  expect(screen.queryByText('Com garantia')).not.toBeInTheDocument();
});

it('mantém híbrido na motorização e identifica CVT como câmbio automático', () => {
  const view = render(
    <VehicleSummary
      vehicle={{ ...vehicle, fuel: 'HIBRIDO', transmission: 'CVT' }}
    />,
  );
  expect(
    within(screen.getByText('Motorização').parentElement).getByText('Híbrida'),
  ).toBeInTheDocument();
  expect(
    within(screen.getByText('Câmbio').parentElement).getByText(
      'Automático (CVT)',
    ),
  ).toBeInTheDocument();
  view.rerender(
    <VehicleSummary vehicle={{ ...vehicle, transmission: 'HIBRIDO' }} />,
  );
  expect(screen.queryByText('Câmbio')).not.toBeInTheDocument();
});
