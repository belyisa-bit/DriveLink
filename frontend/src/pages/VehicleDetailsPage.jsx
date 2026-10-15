import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Skeleton } from '../components/Skeleton';
import { VehicleBreadcrumb } from '../features/vehicle-detail/VehicleBreadcrumb';
import { VehicleGallery } from '../features/vehicle-detail/VehicleGallery';
import { getVehicleDetail } from '../features/vehicle-detail/vehicleDetailsApi';

export function VehicleDetailsPage() {
  const { slug } = useParams();
  const query = useQuery({
    queryKey: ['vehicles', 'detail', slug],
    queryFn: (context) => getVehicleDetail(slug, context),
    retry: false,
  });
  const vehicle = query.data;
  const modelKey = vehicle ? `${vehicle.brand}|${vehicle.model}` : '';
  const previousModel = useRef(null);
  useEffect(() => {
    if (modelKey && modelKey !== previousModel.current) {
      window.scrollTo({ top: 0, left: 0 });
      previousModel.current = modelKey;
    }
  }, [modelKey]);

  if (query.isPending)
    return (
      <div
        role="status"
        aria-label="Carregando detalhes do veículo"
        className="mx-auto max-w-7xl space-y-6 px-5 py-10 sm:px-8 lg:px-10"
      >
        <span className="sr-only">Carregando detalhes do veículo…</span>
        <Skeleton className="h-5 w-60" />
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[3/2] h-auto rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  if (query.isError) {
    const notFound = query.error?.response?.status === 404;
    return (
      <div
        role="status"
        className="mx-auto max-w-7xl space-y-5 px-5 py-16 sm:px-8 lg:px-10"
      >
        <h1 className="text-3xl font-bold text-slate-950">
          {notFound
            ? 'Veículo não encontrado'
            : 'Não foi possível carregar este veículo'}
        </h1>
        <p className="text-slate-600">
          {notFound
            ? 'Confira outras opções disponíveis no nosso estoque.'
            : 'Tente novamente para consultar os detalhes.'}
        </p>
        <div className="flex flex-wrap gap-3">
          {!notFound && (
            <Button onClick={() => query.refetch()} disabled={query.isFetching}>
              Tentar novamente
            </Button>
          )}
          <Button to="/estoque" variant="outline">
            Voltar ao estoque
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
      <VehicleBreadcrumb vehicle={vehicle} />
      <h1 className="sr-only">{vehicle.brand} {vehicle.model}</h1>
      <VehicleGallery key={slug} vehicle={vehicle} />
    </div>
  );
}
