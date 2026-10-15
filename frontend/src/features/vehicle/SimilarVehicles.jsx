import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/Button';
import { VehicleCard } from '../../components/VehicleCard';
import { Skeleton } from '../../components/Skeleton';
import { getSimilarVehicles } from './vehicleDetailsApi';

export function SimilarVehicles({ vehicle }) {
  const query = useQuery({
    queryKey: ['vehicles', 'similar', vehicle.slug],
    queryFn: (context) => getSimilarVehicles(vehicle, context),
    staleTime: 60000,
  });
  return (
    <section
      aria-labelledby="similar-vehicles-title"
      className="mt-12 border-t border-slate-200 pt-10"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            Outras possibilidades
          </p>
          <h2
            id="similar-vehicles-title"
            className="text-2xl font-extrabold text-slate-950 sm:text-3xl"
          >
            Veículos similares
          </h2>
        </div>
        <Button to="/estoque" variant="outline" className="min-h-10 px-4 py-2">
          Ver todo o estoque
        </Button>
      </div>
      {query.isPending ? (
        <div
          role="status"
          aria-label="Carregando veículos similares"
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="sr-only">Carregando veículos similares…</span>
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : query.isError ? (
        <div
          role="status"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6"
        >
          <p className="text-sm text-slate-600">
            Não foi possível carregar as sugestões.
          </p>
          <Button
            variant="outline"
            onClick={() => query.refetch()}
            disabled={query.isFetching}
          >
            Tentar carregar sugestões
          </Button>
        </div>
      ) : query.data.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {query.data.map((item) => (
            <VehicleCard key={item.slug} vehicle={item} layout="catalog" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Não há sugestões semelhantes no momento. Confira outros modelos no
          estoque.
        </p>
      )}
    </section>
  );
}
