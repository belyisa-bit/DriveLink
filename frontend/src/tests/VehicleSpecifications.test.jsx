import { render, screen, within } from '@testing-library/react';
import { VehicleSpecifications } from '../features/vehicle-detail/VehicleSpecifications';

const vehicle = {
  brand: 'Honda',
  model: 'Civic',
  version: 'EXL 2.0',
  year: 2021,
  mileage: 38000,
  color: 'Prata',
  fuel: 'FLEX',
  transmission: 'CVT',
  engine: '2.0',
  bodyType: 'SEDAN',
  doors: 4,
  plateEnding: '0',
  hasWarranty: true,
  description:
    'Veículo com histórico de manutenção disponível.\nAgende sua visita.',
  features: ['Ar-condicionado', ' Câmera de ré ', 'Ar-condicionado', '', null],
};

it('exibe descrição, todas as especificações cadastradas e itens com ícones', () => {
  render(<VehicleSpecifications vehicle={vehicle} />);
  expect(
    screen.getByRole('heading', { name: 'Sobre este veículo' }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Veículo com histórico de manutenção disponível/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Especificações' }),
  ).toBeInTheDocument();
  const table = screen.getByRole('table', {
    name: 'Especificações de Honda Civic',
  });
  for (const [label, value] of [
    ['Marca', 'Honda'],
    ['Modelo', 'Civic'],
    ['Versão', 'EXL 2.0'],
    ['Ano', '2021'],
    ['Quilometragem', '38.000 km'],
    ['Cor', 'Prata'],
    ['Combustível', 'Flex'],
    ['Câmbio', 'CVT'],
    ['Motor', '2.0'],
    ['Carroceria', 'Sedã'],
    ['Portas', '4'],
    ['Final de placa', '0'],
    ['Garantia', 'Com garantia'],
  ]) {
    const row = within(table)
      .getByRole('rowheader', { name: label })
      .closest('tr');
    expect(within(row).getByRole('cell')).toHaveTextContent(value);
  }
  const items = screen.getAllByRole('listitem');
  expect(items).toHaveLength(2);
  expect(items.map((item) => item.textContent)).toEqual([
    'Ar-condicionado',
    'Câmera de ré',
  ]);
  for (const item of items)
    expect(item.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

it('diferencia garantia não cadastrada de unidade sem garantia e atualiza os dados da unidade', () => {
  const view = render(<VehicleSpecifications vehicle={vehicle} />);
  view.rerender(
    <VehicleSpecifications
      vehicle={{
        brand: 'Honda',
        model: 'Civic',
        plateEnding: 0,
        hasWarranty: false,
      }}
    />,
  );
  expect(screen.getByText('Sem garantia')).toBeInTheDocument();
  expect(
    screen.getByRole('rowheader', { name: 'Final de placa' }).closest('tr'),
  ).toHaveTextContent('0');
  expect(screen.queryByText('Com garantia')).not.toBeInTheDocument();
  expect(screen.queryByText('Ar-condicionado')).not.toBeInTheDocument();
  view.rerender(
    <VehicleSpecifications vehicle={{ brand: 'Honda', model: 'Civic' }} />,
  );
  expect(
    screen.getByRole('rowheader', { name: 'Garantia' }).closest('tr'),
  ).toHaveTextContent('Consulte nossa equipe');
  for (const label of [
    'Motor',
    'Portas',
    'Combustível',
    'Câmbio',
    'Final de placa',
  ]) {
    expect(
      screen.queryByRole('rowheader', { name: label }),
    ).not.toBeInTheDocument();
  }
});

it('mantém as seções utilizáveis sem descrição ou equipamentos cadastrados', () => {
  const view = render(
    <VehicleSpecifications
      vehicle={{
        brand: 'Fiat',
        model: 'Argo',
        description: '  ',
        features: [null, '', '  ', 123],
      }}
    />,
  );
  expect(
    screen.getByText(
      /Fale com nossa equipe para saber mais sobre esta unidade/,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Consulte nossa equipe para confirmar os equipamentos/),
  ).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
  view.rerender(
    <VehicleSpecifications
      vehicle={{ brand: 'Fiat', model: 'Argo', features: 'Ar-condicionado' }}
    />,
  );
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});
