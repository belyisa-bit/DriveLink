import { Check } from 'lucide-react';
import { Card } from '../../components/Card';
import { formatKm } from '../../lib/formatters';
import { getVehicleFuelFact } from '../../lib/vehicleFuel';

const labels = {
  AUTOMATICO: 'Automático',
  MANUAL: 'Manual',
  CVT: 'CVT',
  HATCHBACK: 'Hatch',
  SEDAN: 'Sedã',
  SUV: 'SUV',
  PICKUP: 'Picape',
  COUPE: 'Cupê',
};
export function VehicleSpecifications({ vehicle }) {
  const facts = [
    ['Marca', vehicle.brand],
    ['Modelo', vehicle.model],
    ['Versão', vehicle.version],
    ['Ano', vehicle.year],
    [
      'Quilometragem',
      vehicle.mileage == null ? null : formatKm(vehicle.mileage),
    ],
    ['Cor', vehicle.color],
    getVehicleFuelFact(vehicle.fuel),
    ['Câmbio', labels[vehicle.transmission]],
    ['Motor', vehicle.engine],
    ['Carroceria', labels[vehicle.bodyType] || vehicle.bodyType],
    ['Portas', vehicle.doors],
    ['Final de placa', vehicle.plateEnding],
    [
      'Garantia',
      vehicle.hasWarranty === true
        ? 'Com garantia'
        : vehicle.hasWarranty === false
          ? 'Sem garantia'
          : 'Consulte nossa equipe',
    ],
  ].filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  const features = [
    ...new Set(
      (Array.isArray(vehicle.features) ? vehicle.features : [])
        .filter((feature) => typeof feature === 'string')
        .map((feature) => feature.trim())
        .filter(Boolean),
    ),
  ];
  return (
    <div className="space-y-6">
      <Card
        as="section"
        aria-labelledby="vehicle-description-title"
        className="sm:p-6"
      >
        <h2
          id="vehicle-description-title"
          className="text-xl font-bold text-slate-950"
        >
          Sobre este veículo
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">
          {vehicle.description?.trim() ||
            'Fale com nossa equipe para saber mais sobre esta unidade e agendar uma visita.'}
        </p>
      </Card>
      <Card
        as="section"
        aria-labelledby="vehicle-specifications-title"
        className="sm:p-6"
      >
        <h2
          id="vehicle-specifications-title"
          className="mb-5 text-xl font-bold text-slate-950"
        >
          Especificações
        </h2>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Especificações de {vehicle.brand} {vehicle.model}
          </caption>
          <tbody>
            {facts.map(([label, value]) => (
              <tr
                key={label}
                className="border-b border-slate-100 last:border-0"
              >
                <th
                  scope="row"
                  className="w-1/2 py-3 pr-4 font-medium text-slate-500"
                >
                  {label}
                </th>
                <td className="break-words py-3 font-semibold text-slate-900">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <Card
        as="section"
        aria-labelledby="vehicle-features-title"
        className="sm:p-6"
      >
        <h2
          id="vehicle-features-title"
          className="text-xl font-bold text-slate-950"
        >
          Principais itens
        </h2>
        {features.length ? (
          <ul className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-brand"
                />
                {feature}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Consulte nossa equipe para confirmar os equipamentos desta unidade.
          </p>
        )}
      </Card>
    </div>
  );
}
