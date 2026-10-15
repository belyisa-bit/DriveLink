import { render, screen } from '@testing-library/react';
import { getCatalogFuel } from '../features/catalog/catalogFuels';
import { mockCatalogVehicles } from '../features/catalog/mockCatalogVehicles';
import { VehicleSummary } from '../features/vehicle-detail/VehicleSummary';

it('respeita a geração e deixa combustível indefinido quando depende da versão', () => {
  expect(getCatalogFuel('Jeep', 'Renegade', 2021)).toBeNull();
  expect(getCatalogFuel('Jeep', 'Renegade', 2022)).toBe('FLEX');
  expect(getCatalogFuel('Honda', 'HR-V', 2021)).toBeNull();
  expect(getCatalogFuel('Honda', 'HR-V', 2023)).toBe('FLEX');
  expect(getCatalogFuel('Nissan', 'Sentra', 2023)).toBe('GASOLINA');
  for (const args of [
    ['Jeep', 'Compass', 2023],
    ['Fiat', 'Toro', 2022],
    ['Honda', 'Civic', 2021],
    ['Toyota', 'Corolla', 2026],
    ['Toyota', 'Corolla', null],
    ['Toyota', 'Corolla', '2022'],
    ['Outra marca', 'Corolla', 2022],
  ])
    expect(getCatalogFuel(...args)).toBeNull();
});

it('mostra o combustível cadastrado no resumo, ocultando o desconhecido', () => {
  const vehicle = mockCatalogVehicles.find(
    (item) =>
      item.brand === 'Toyota' && item.model === 'Corolla' && item.year === 2022,
  );
  expect(vehicle.fuel).toBe('FLEX');
  const view = render(
    <>
      <VehicleSummary vehicle={vehicle} />
    </>,
  );
  expect(screen.getAllByText('Combustível')).toHaveLength(1);
  expect(screen.getAllByText('Flex')).toHaveLength(1);
  view.rerender(
    <>
      <VehicleSummary vehicle={{ ...vehicle, fuel: null }} />
    </>,
  );
  expect(screen.queryByText('Combustível')).not.toBeInTheDocument();
  expect(screen.queryByText('Flex')).not.toBeInTheDocument();
});

it('não confunde motorização híbrida com combustível nas duas seções', () => {
  const vehicle = { brand: 'Toyota', model: 'Corolla', fuel: 'HIBRIDO' };
  render(
    <>
      <VehicleSummary vehicle={vehicle} />
    </>,
  );
  expect(screen.getAllByText('Motorização')).toHaveLength(1);
  expect(screen.getAllByText('Híbrida')).toHaveLength(1);
  expect(screen.queryByText('Combustível')).not.toBeInTheDocument();
});
