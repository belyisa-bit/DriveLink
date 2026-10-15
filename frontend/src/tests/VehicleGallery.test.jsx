import { fireEvent, render, screen } from '@testing-library/react';
import { VehicleGallery } from '../features/vehicle-detail/VehicleGallery';

const vehicle = {
  brand: 'Fiat',
  model: 'Argo',
  images: [
    { url: 'lateral.webp', displayOrder: 1 },
    { url: 'frente.webp', displayOrder: 0, isMain: true },
    { url: 'interior.webp', displayOrder: 2 },
  ],
};

it('começa pela foto principal e permite navegar por miniaturas e teclado', () => {
  render(<VehicleGallery vehicle={vehicle} />);
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 1' }),
  ).toHaveAttribute('src', 'frente.webp');
  fireEvent.click(
    screen.getByRole('button', { name: 'Ver foto 2 de Fiat Argo' }),
  );
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 2' }),
  ).toHaveAttribute('src', 'lateral.webp');
  expect(
    screen.getByRole('button', { name: 'Ver foto 2 de Fiat Argo' }),
  ).toHaveAttribute('aria-pressed', 'true');
  fireEvent.keyDown(
    screen.getByRole('region', { name: 'Fotos de Fiat Argo' }),
    { key: 'ArrowRight' },
  );
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 3' }),
  ).toHaveAttribute('src', 'interior.webp');
  fireEvent.click(screen.getByRole('button', { name: 'Próxima foto' }));
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 1' }),
  ).toHaveAttribute('src', 'frente.webp');
});

it('ignora imagens com erro e mostra estado seguro se nenhuma estiver disponível', () => {
  const view = render(
    <VehicleGallery
      vehicle={{
        ...vehicle,
        images: [
          { url: 'quebrada.webp', isMain: true },
          { url: 'valida.webp' },
        ],
      }}
    />,
  );
  fireEvent.error(screen.getByRole('img', { name: 'Fiat Argo — foto 1' }));
  expect(
    screen.getByRole('img', { name: 'Fiat Argo — foto 2' }),
  ).toHaveAttribute('src', 'valida.webp');
  fireEvent.error(screen.getByRole('img', { name: 'Fiat Argo — foto 2' }));
  expect(screen.getByText('Imagem indisponível')).toBeInTheDocument();
  view.rerender(
    <VehicleGallery
      key="outro"
      vehicle={{ brand: 'Fiat', model: 'Mobi', mainImageUrl: 'mobi.webp' }}
    />,
  );
  expect(
    screen.getByRole('img', { name: 'Fiat Mobi — foto 1' }),
  ).toHaveAttribute('src', 'mobi.webp');
});

it('mostra os créditos somente da foto selecionada e troca a imagem quando muda a unidade', () => {
  const old = {
    brand: 'Honda',
    model: 'Civic',
    year: 2015,
    mainImageUrl: 'civic-2015.jpg',
    imageCredit: {
      author: 'Fotógrafo 2015',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Civic2015.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
  };
  const view = render(<VehicleGallery vehicle={old} />);
  expect(
    screen.getByRole('img', { name: 'Honda Civic — foto 1' }),
  ).toHaveAttribute('src', 'civic-2015.jpg');
  fireEvent.click(screen.getByText('Créditos da foto'));
  expect(screen.getByRole('link', { name: 'Fotógrafo 2015' })).toHaveAttribute(
    'href',
    old.imageCredit.sourceUrl,
  );
  view.rerender(
    <VehicleGallery
      vehicle={{
        ...old,
        year: 2021,
        mainImageUrl: 'civic-2021.jpg',
        imageCredit: null,
      }}
    />,
  );
  expect(
    screen.getByRole('img', { name: 'Honda Civic — foto 1' }),
  ).toHaveAttribute('src', 'civic-2021.jpg');
  expect(screen.queryByText('Fotógrafo 2015')).not.toBeInTheDocument();
});
