import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { readCatalogLocation, updateCatalogLocation } from '../features/catalog/catalogLocation';
import { useCatalogLocation } from '../features/catalog/useCatalogLocation';

it('lê filtros e página do link com acentos, espaços e preço decimal', () => {
  const query = new URLSearchParams('brand=Citro%C3%ABn&model=C4+Cactus&search=+carro+&minPrice=150000.01&minYear=2023&maxYear=2023&sortBy=mileage_asc&page=2');
  expect(readCatalogLocation(query)).toEqual({ params: { brand: 'Citroën', model: 'C4 Cactus', search: 'carro', minPrice: '150000.01', minYear: '2023', maxYear: '2023', sortBy: 'mileage_asc' }, page: 2 });
});

it.each(['-1', '1.5', 'abc', 'Infinity', '9007199254740992'])('trata página inválida %s como inicial', (page) => {
  expect(readCatalogLocation(new URLSearchParams({ page })).page).toBe(0);
});

it('ignora valores inválidos e intervalos invertidos sem enviar números inválidos à API', () => {
  expect(readCatalogLocation(new URLSearchParams('minPrice=-5&maxPrice=Infinity&minYear=2024&maxYear=2020&sortBy=invalid')).params).toEqual({});
  expect(readCatalogLocation(new URLSearchParams('minPrice=200000&maxPrice=100000&minYear=2020.5&maxYear=no')).params).toEqual({});
});

it('atualiza filtros sem perder busca e ordem, reinicia página e preserva parâmetros externos', () => {
  const result = updateCatalogLocation(new URLSearchParams('search=C3&sortBy=price_asc&page=3&utm_source=teste'), { brand: 'Citroën', model: 'C3' });
  expect(Object.fromEntries(result)).toEqual({ search: 'C3', sortBy: 'price_asc', utm_source: 'teste', brand: 'Citroën', model: 'C3' });
});

function Harness() {
  const { params, page, setPage, sort } = useCatalogLocation();
  const navigate = useNavigate();
  return <><p data-testid="query">{useLocation().search}</p><p data-testid="page">{page}</p><p data-testid="brand">{params.brand}</p><button onClick={() => setPage(2)}>Página 3</button><button onClick={() => setPage(0)}>Página 1</button><button onClick={() => sort('price_asc')}>Ordenar</button><button onClick={() => navigate(-1)}>Voltar</button><button onClick={() => navigate(1)}>Avançar</button></>;
}

it('sincroniza página e histórico sem apagar os filtros; ordenar retorna à página inicial', () => {
  render(<MemoryRouter initialEntries={['/estoque?brand=Toyota&maxPrice=150000']} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><Harness /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Página 3' }));
  expect(screen.getByTestId('page')).toHaveTextContent('2');
  expect(screen.getByTestId('query').textContent).toBe('?brand=Toyota&maxPrice=150000&page=2');
  fireEvent.click(screen.getByRole('button', { name: 'Ordenar' }));
  expect(screen.getByTestId('page')).toHaveTextContent('0');
  expect(screen.getByTestId('query').textContent).toBe('?brand=Toyota&maxPrice=150000&sortBy=price_asc');
  fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
  expect(screen.getByTestId('page')).toHaveTextContent('2');
  fireEvent.click(screen.getByRole('button', { name: 'Avançar' }));
  expect(screen.getByTestId('page')).toHaveTextContent('0');
  expect(screen.getByTestId('brand')).toHaveTextContent('Toyota');
});
