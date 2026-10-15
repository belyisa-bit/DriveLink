import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VehicleBreadcrumb } from '../features/vehicle/VehicleBreadcrumb';

it('oferece links para início e estoque e identifica o veículo atual', () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <VehicleBreadcrumb
        vehicle={{ brand: 'Honda', model: 'Civic', year: 2015 }}
      />
    </MemoryRouter>,
  );
  const breadcrumb = screen.getByRole('navigation', {
    name: 'Navegação estrutural',
  });
  expect(
    within(breadcrumb).getByRole('link', { name: 'Início' }),
  ).toHaveAttribute('href', '/');
  expect(
    within(breadcrumb).getByRole('link', { name: 'Estoque' }),
  ).toHaveAttribute('href', '/estoque');
  expect(
    within(breadcrumb).getByRole('link', { name: 'Honda' }),
  ).toHaveAttribute('href', '/estoque?brand=Honda');
  expect(
    within(breadcrumb).getByRole('link', { name: 'Civic' }),
  ).toHaveAttribute('href', '/estoque?brand=Honda&model=Civic');
  expect(
    within(breadcrumb)
      .getAllByRole('listitem')
      .filter((item) => !item.hasAttribute('aria-hidden'))
      .map((item) => item.textContent),
  ).toEqual(['Início', 'Estoque', 'Honda', 'Civic', 'Honda Civic 2015']);
  expect(within(breadcrumb).getByText('Honda Civic 2015')).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    within(breadcrumb).queryByRole('link', { name: 'Honda Civic 2015' }),
  ).not.toBeInTheDocument();
});

it.each([
  ['Citroën', 'C4 Cactus'],
  ['Toyota', 'Corolla Cross'],
])('preserva marca e modelo nos filtros de %s %s', (brand, model) => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <VehicleBreadcrumb vehicle={{ brand, model, year: 2024 }} />
    </MemoryRouter>,
  );
  const brandUrl = new URL(screen.getByRole('link', { name: brand }).href);
  const modelUrl = new URL(screen.getByRole('link', { name: model }).href);
  expect(brandUrl.pathname).toBe('/estoque');
  expect([...brandUrl.searchParams]).toEqual([['brand', brand]]);
  expect([...modelUrl.searchParams]).toEqual([
    ['brand', brand],
    ['model', model],
  ]);
});
