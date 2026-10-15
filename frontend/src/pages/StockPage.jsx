import { useQuery } from '@tanstack/react-query';
import { CatalogHero } from '../features/catalog/CatalogHero';
import { CatalogSearch } from '../features/catalog/CatalogSearch';
import { getCatalogVehicles } from '../features/catalog/catalogApi';
import { CatalogModelCard } from '../features/catalog/CatalogModelCard';
import { groupCatalogVehicles } from '../features/catalog/catalogGroups';
import { Button } from '../components/Button';
import { CtaBanner } from '../components/CtaBanner';
import { CatalogFilters } from '../features/catalog/CatalogFilters';
import { CatalogToolbar } from '../features/catalog/CatalogToolbar';
import { useCatalogLocation } from '../features/catalog/useCatalogLocation';

export function StockPage() {
  const { params, filtersKey, search, applyFilters, sort } = useCatalogLocation();
  const query = useQuery({ queryKey: ['vehicles', 'catalog', params], queryFn: (context) => getCatalogVehicles(params, context) });
  const groups = groupCatalogVehicles(query.data?.content || [], params.sortBy);

  return (
    <>
      <CatalogHero />
      <div className="mx-auto max-w-7xl px-5 pb-8 sm:px-8 lg:px-10">
        <CatalogSearch search={params.search || ''} onSearch={search} />
        <div className="grid items-start gap-6 py-8 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
        <CatalogFilters key={filtersKey} applied={params} onApply={applyFilters} onClear={() => applyFilters({})} />
        <section aria-label="Resultados da busca" className="min-w-0">
          <CatalogToolbar models={groups.length} total={query.data?.totalElements ?? query.data?.content.length ?? 0} loading={query.isPending} error={query.isError} sort={params.sortBy || 'recent'} onSort={sort} />
          {query.isPending ? <p role="status" className="py-8 text-slate-600">Carregando veículos…</p> : query.isError ? (
            <div role="status" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-slate-600">Não foi possível carregar o estoque. Tente novamente.</p>
              <Button variant="outline" disabled={query.isFetching} onClick={() => query.refetch()}>Tentar novamente</Button>
            </div>
          ) : query.data.content.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groups.map((group) => <CatalogModelCard key={group.key} group={group} />)}</div>
          ) : <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Nenhum veículo encontrado. Tente outra busca ou ajuste os filtros.</p>}
        </section>
        </div>
        <CtaBanner title="Seu próximo carro está" highlight="mais perto." />
      </div>
    </>
  );
}
