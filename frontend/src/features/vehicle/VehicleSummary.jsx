import {
  CalendarDays,
  Fuel,
  Gauge,
  Settings2,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../components/Badge';
import { formatBRL, formatKm } from '../../lib/formatters';
import { getVehicleFuelFact } from '../../lib/vehicleFuel';

const transmissionLabels = {
  AUTOMATICO: 'Automático',
  MANUAL: 'Manual',
  CVT: 'Automático (CVT)',
};

export function VehicleSummary({ vehicle }) {
  const [fuelLabel, fuelValue] = getVehicleFuelFact(vehicle.fuel);
  const summary = [
    {
      Icon: CalendarDays,
      label: 'Ano',
      value: vehicle.year ?? 'Não informado',
    },
    { Icon: Gauge, label: 'Quilometragem', value: formatKm(vehicle.mileage) },
    {
      Icon: Fuel,
      label: fuelLabel,
      value: fuelValue,
    },
    {
      Icon: Settings2,
      label: 'Câmbio',
      value: transmissionLabels[vehicle.transmission] || null,
    },
  ].filter((item) => item.value !== null);
  return (
    <header className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
        Seu próximo carro
      </p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        {vehicle.brand} {vehicle.model}
        {vehicle.version && (
          <span className="mt-2 block text-lg font-medium tracking-normal text-slate-600">
            {vehicle.version}
          </span>
        )}
      </h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant={vehicle.status === 'DISPONIVEL' ? 'brand' : 'neutral'}>
          {vehicle.status === 'DISPONIVEL' ? 'Disponível' : 'Indisponível'}
        </Badge>
        {vehicle.reviewed === true && (
          <Badge variant="success">
            <ShieldCheck size={13} aria-hidden="true" />
            Revisado
          </Badge>
        )}
        {vehicle.hasWarranty === true && (
          <Badge variant="success">Com garantia</Badge>
        )}
        {vehicle.singleOwner === true && <Badge>Único dono</Badge>}
      </div>
      <p
        aria-live="polite"
        aria-atomic="true"
        className="my-6 text-3xl font-extrabold text-brand sm:text-4xl"
      >
        {formatBRL(vehicle.price)}
      </p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-5 border-t border-slate-100 pt-5">
        {summary.map(({ Icon, label, value }) => (
          <div key={label} className="min-w-0">
            <dt className="flex items-center gap-1.5 text-xs text-slate-500">
              <Icon size={15} aria-hidden="true" />
              {label}
            </dt>
            <dd className="mt-2 break-words text-sm font-semibold text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
