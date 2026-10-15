import { useState } from 'react';
import { ArrowRight, Car } from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { formatBRL } from '../../lib/formatters';

export function CatalogModelCard({ group }) {
  const [failedImage, setFailedImage] = useState(null);
  const name = `${group.brand} ${group.model}`;
  const vehicle = group.vehicles.reduce((lowest, current) => current.price < lowest.price ? current : lowest);
  const image = vehicle.mainImageUrl || group.vehicles.find((item) => item.mainImageUrl)?.mainImageUrl;
  return (
    <Card as="article" className="flex h-full flex-col p-3 transition-shadow duration-200 hover:shadow-lg focus-within:shadow-lg motion-safe:transition-[transform,box-shadow] motion-safe:hover:-translate-y-1 motion-safe:focus-within:-translate-y-1">
      <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-stone-100">
        {image && failedImage !== image ? <img src={image} alt={name} width="900" height="600" loading="lazy" decoding="async" onError={() => setFailedImage(image)} className="h-full w-full object-contain" /> : <Car size={36} aria-label="Imagem indisponível" className="text-slate-400" />}
      </div>
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        <h3 className="text-lg font-bold tracking-tight text-slate-950">{name}</h3>
        <p className="mt-1 text-sm text-slate-600">{group.years.at(-1)}{group.years.length > 1 ? ` a ${group.years[0]}` : ''} · {group.vehicles.length} {group.vehicles.length === 1 ? 'opção' : 'opções'}</p>
        <div className="mt-auto space-y-3 pt-4">
          <p className="text-sm text-slate-600">A partir de <strong className="block text-xl font-extrabold text-brand">{formatBRL(group.price)}</strong></p>
          <Button to={`/estoque/${encodeURIComponent(vehicle.slug)}`} variant="outline" aria-label={`Ver detalhes de ${name}`} className="w-full px-4 text-xs">Ver detalhes <ArrowRight size={16} aria-hidden="true" /></Button>
        </div>
      </div>
    </Card>
  );
}
