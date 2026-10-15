import { Skeleton } from '../../components/Skeleton';
import { catalogPageSize } from './CatalogPagination';

export function CatalogSkeleton() {
  return <div role="status" aria-label="Carregando veículos" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><span className="sr-only">Carregando veículos…</span>{Array.from({ length: catalogPageSize }, (_, index) => <div key={index} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3"><Skeleton className="aspect-[3/2] h-auto rounded-xl" /><Skeleton className="h-6 w-3/4" /><Skeleton className="w-1/2" /><Skeleton className="h-7 w-2/3" /><Skeleton className="h-12 w-full rounded-xl" /></div>)}</div>;
}
