import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { groupCatalogVehicles } from '../features/catalog/catalogGroups';
import { CatalogModelCard } from '../features/catalog/CatalogModelCard';

const vehicles = [
  { id: 'a', brand: 'Fiat', model: 'Argo', year: 2024, color: 'Branco', mileage: 10000, price: 80000, slug: 'argo-a' },
  { id: 'b', brand: 'Fiat', model: 'Argo', year: 2024, color: 'Preto', mileage: 20000, price: 75000, slug: 'argo-b' },
  { id: 'c', brand: 'Fiat', model: 'Argo', year: 2020, color: 'Prata', mileage: 60000, price: 50000, slug: 'argo-c' },
  { id: 'd', brand: 'Fiat', model: 'Mobi', year: 2023, color: 'Branco', mileage: 30000, price: 55000, slug: 'mobi' },
];

it('agrupa modelos preservando as unidades e ordena pelo menor preço disponível', () => {
  const groups = groupCatalogVehicles(vehicles, 'price_asc');
  expect(groups).toHaveLength(2);
  expect(groups[0]).toMatchObject({ model: 'Argo', price: 50000, years: [2024, 2020] });
  expect(groups[0].vehicles).toHaveLength(3);
  expect(groupCatalogVehicles(vehicles, 'price_desc')[0].model).toBe('Mobi');
  expect(groupCatalogVehicles(vehicles.filter((vehicle) => vehicle.year === 2024))[0].vehicles).toHaveLength(2);
});

function Details() {
  return <h1>Detalhes de {useParams().slug}</h1>;
}

it('Ver detalhes navega para a URL da unidade com o preço anunciado no card', async () => {
  render(<MemoryRouter initialEntries={['/estoque']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Routes><Route path="/estoque" element={<CatalogModelCard group={groupCatalogVehicles(vehicles)[0]} />} /><Route path="/estoque/:slug" element={<Details />} /></Routes></MemoryRouter>);
  const link = screen.getByRole('link', { name: 'Ver detalhes de Fiat Argo' });
  expect(link).toHaveAttribute('href', '/estoque/argo-c');
  expect(link).toHaveTextContent('Ver detalhes');
  fireEvent.click(link);
  expect(await screen.findByRole('heading', { name: 'Detalhes de argo-c' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('prioriza a foto da unidade anunciada e recupera a imagem ao mudar os resultados do modelo', () => {
  const initial = groupCatalogVehicles(vehicles.slice(0, 2).map((vehicle) => ({ ...vehicle, mainImageUrl: `${vehicle.slug}.webp` })))[0];
  const view = render(<MemoryRouter><CatalogModelCard group={initial} /></MemoryRouter>);
  expect(screen.getByRole('img', { name: 'Fiat Argo' })).toHaveAttribute('src', 'argo-b.webp');
  fireEvent.error(screen.getByRole('img', { name: 'Fiat Argo' }));
  expect(screen.queryByRole('img', { name: 'Fiat Argo' })).not.toBeInTheDocument();
  const next = groupCatalogVehicles([{ ...vehicles[2], mainImageUrl: 'argo-c.webp' }])[0];
  view.rerender(<MemoryRouter><CatalogModelCard group={next} /></MemoryRouter>);
  expect(screen.getByRole('img', { name: 'Fiat Argo' })).toHaveAttribute('src', 'argo-c.webp');
  expect(screen.getByRole('link', { name: 'Ver detalhes de Fiat Argo' })).toHaveAttribute('href', '/estoque/argo-c');
});
