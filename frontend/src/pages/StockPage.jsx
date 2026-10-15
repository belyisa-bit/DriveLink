import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { CatalogHero } from '../features/catalog/CatalogHero';
import { CatalogSearch } from '../features/catalog/CatalogSearch';
import { catalogParams, getCatalogVehicles } from '../features/catalog/catalogApi';
import { VehicleCard } from '../components/VehicleCard';
import { Button } from '../components/Button';
import { CtaBanner } from '../components/CtaBanner';

export function StockPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = catalogParams(searchParams);
  const query = useQuery({ queryKey: ['vehicles', 'catalog', params], queryFn: (context) => getCatalogVehicles(params, context) });

  function handleSearch(search) {
    const next = new URLSearchParams(searchParams);
    if (search) next.set('search', search);
    else next.delete('search');
    next.delete('page');
    setSearchParams(next);
  }

  return (
    <>
      <CatalogHero />
      <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
        <CatalogSearch search={params.search || ''} onSearch={handleSearch} />
        <section aria-label="Resultados da busca" className="py-8">
          {query.isPending ? <p role="status" className="py-8 text-slate-600">Carregando veículos…</p> : query.isError ? (
            <div role="status" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-600">Não foi possível carregar o estoque. Tente novamente.</p>
              <Button variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>Tentar novamente</Button>
            </div>
          ) : query.data.content.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{query.data.content.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} layout="catalog" />)}</div>
          ) : <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Nenhum veículo encontrado. Tente outra busca ou ajuste os filtros.</p>}
        </section>
        <CtaBanner title="Seu próximo carro está" highlight="mais perto." />
      </div>
    </>
  );
}
