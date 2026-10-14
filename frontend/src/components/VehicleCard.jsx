import { useState } from 'react';
import { ArrowRight, Car } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';
import { formatBRL, formatKm } from '../lib/formatters';

export function VehicleCard({ vehicle }) {
  const [failedImage, setFailedImage] = useState(null);
  const name = `${vehicle.brand} ${vehicle.model}`;
  const hasImage = vehicle.mainImageUrl && failedImage !== vehicle.mainImageUrl;

  return (
    <Card as="article" className="flex h-full flex-col p-3 transition-shadow duration-200 hover:shadow-lg focus-within:shadow-lg motion-safe:transition-[transform,box-shadow] motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1">
      <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-stone-100">
        {hasImage ? (
          <img src={vehicle.mainImageUrl} alt={name} width="600" height="400" loading="lazy" decoding="async" onError={() => setFailedImage(vehicle.mainImageUrl)} className="h-full w-full object-contain" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-slate-500"><Car size={36} aria-hidden="true" /><span>Imagem indisponível</span></div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-lg font-bold tracking-tight text-slate-950">{name}</h3>
        <p className="mt-1 text-sm text-slate-600">{vehicle.year ?? '—'}<span aria-hidden="true" className="mx-3 text-slate-300">|</span><span className="sr-only">, </span>{formatKm(vehicle.mileage)}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <p className="text-xl font-extrabold text-brand">{formatBRL(vehicle.price)}</p>
          <Button to={`/estoque/${encodeURIComponent(vehicle.slug)}`} variant="outline" aria-label={`Ver detalhes de ${name}`} className="px-4 text-xs">Ver detalhes <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
      </div>
    </Card>
  );
}
