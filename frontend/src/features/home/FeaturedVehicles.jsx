import { useQuery } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VehicleCard } from '../../components/VehicleCard';
import { Skeleton } from '../../components/Skeleton';
import { Button } from '../../components/Button';
import { getFeaturedVehicles } from './featuredVehiclesApi';

export function FeaturedVehicles() {
  const query = useQuery({ queryKey: ['vehicles', 'featured'], queryFn: getFeaturedVehicles, staleTime: 300000 });
  const vehicles = (query.data || []).filter((vehicle) => vehicle.featured === true && vehicle.status === 'DISPONIVEL').slice(0, 3);

  return (
    <section id="destaques" aria-labelledby="featured-title" className="scroll-mt-6 py-10 sm:py-12">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-brand-hover">Destaques</p>
          <h2 id="featured-title" className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Veículos em destaque</h2>
        </div>
        <Link to="/estoque" className="inline-flex items-center gap-3 rounded text-sm font-semibold text-brand-hover underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand">Ver todo o estoque <ArrowRight size={18} aria-hidden="true" /></Link>
      </div>

      {query.isPending ? (
        <div role="status" aria-label="Carregando veículos em destaque" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <span className="sr-only">Carregando veículos em destaque…</span>
          {[1, 2, 3].map((key) => <div key={key} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3"><Skeleton className="aspect-[3/2] h-auto" /><Skeleton className="h-6 w-2/3" /><Skeleton className="w-1/2" /><Skeleton className="h-10" /></div>)}
        </div>
      ) : query.isError ? (
        <div role="status" className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="mb-4 text-slate-600">Não foi possível carregar os destaques. Tente novamente.</p>
          <Button variant="outline" onClick={() => query.refetch()} disabled={query.isFetching}>Tentar novamente</Button>
        </div>
      ) : vehicles.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div>
      ) : (
        <p role="status" className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">Nenhum veículo em destaque no momento. Confira as opções no estoque.</p>
      )}
    </section>
  );
}
