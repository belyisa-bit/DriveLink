import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VehicleBreadcrumb } from '../features/vehicle-detail/VehicleBreadcrumb';

it('oferece links para início e estoque e identifica o veículo atual', () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <VehicleBreadcrumb vehicle={{ brand: 'Honda', model: 'Civic' }} />
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
  expect(within(breadcrumb).getByText('Honda Civic')).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(
    within(breadcrumb).queryByRole('link', { name: 'Honda Civic' }),
  ).not.toBeInTheDocument();
});
