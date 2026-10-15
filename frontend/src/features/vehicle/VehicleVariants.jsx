import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Gauge, Palette } from 'lucide-react';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { formatBRL, formatKm } from '../../lib/formatters';
import { getVehicleVariants } from './vehicleDetailsApi';

const colorName = (vehicle) => vehicle.color || 'Não informada';

export function VehicleVariants({ vehicle }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['vehicles', 'variants', vehicle.brand, vehicle.model],
    queryFn: (context) =>
      getVehicleVariants(vehicle.brand, vehicle.model, context),
    staleTime: 60000,
  });
  const available = query.data || [];
  const years = [
    ...new Set(available.map((item) => item.year).filter(Number.isInteger)),
  ].sort((a, b) => b - a);
  const yearVehicles = available.filter((item) => item.year === vehicle.year);
  const colors = [...new Set(yearVehicles.map(colorName))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
  const units = yearVehicles
    .filter((item) => colorName(item) === colorName(vehicle))
    .sort((a, b) => a.mileage - b.mileage);
  function choose(next) {
    if (next && next.slug !== vehicle.slug) {
      queryClient.setQueryData(['vehicles', 'detail', next.slug], next);
      navigate(`/estoque/${encodeURIComponent(next.slug)}`);
    }
  }
  if (query.isPending)
    return (
      <p
        role="status"
        className="border-t border-slate-100 pt-5 text-sm text-slate-600"
      >
        Consultando opções disponíveis…
      </p>
    );
  if (query.isError)
    return (
      <div
        role="status"
        className="space-y-3 border-t border-slate-100 pt-5 text-sm text-slate-600"
      >
        <p>Não foi possível consultar outras opções deste modelo.</p>
        <Button variant="outline" onClick={() => query.refetch()}>
          Tentar carregar opções
        </Button>
      </div>
    );
  if (!available.length)
    return (
      <p className="border-t border-slate-100 pt-5 text-sm text-slate-600">
        Não há outras unidades disponíveis deste modelo no momento.
      </p>
    );
  return (
    <section
      aria-labelledby="vehicle-options-title"
      className="space-y-4 border-t border-slate-100 pt-5"
    >
      <h2 id="vehicle-options-title" className="font-bold text-slate-950">
        Escolha sua opção
      </h2>
      <Select
        label="Ano disponível"
        icon={CalendarDays}
        value={years.includes(vehicle.year) ? String(vehicle.year) : ''}
        onChange={(event) => {
          const matches = available.filter(
            (item) => String(item.year) === event.target.value,
          );
          choose(
            matches.find((item) => colorName(item) === colorName(vehicle)) ||
              matches[0],
          );
        }}
      >
        {!years.includes(vehicle.year) && (
          <option value="" disabled>
            Selecione um ano
          </option>
        )}
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
      <Select
        label="Cor disponível"
        icon={Palette}
        disabled={!colors.length}
        value={colors.includes(colorName(vehicle)) ? colorName(vehicle) : ''}
        onChange={(event) =>
          choose(
            yearVehicles.find((item) => colorName(item) === event.target.value),
          )
        }
      >
        {!colors.includes(colorName(vehicle)) && (
          <option value="" disabled>
            {colors.length ? 'Selecione uma cor' : 'Sem opções disponíveis'}
          </option>
        )}
        {colors.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </Select>
      <Select
        label="Quilometragem disponível"
        icon={Gauge}
        disabled={!units.length}
        value={
          units.some((item) => item.slug === vehicle.slug) ? vehicle.slug : ''
        }
        onChange={(event) =>
          choose(units.find((item) => item.slug === event.target.value))
        }
      >
        {!units.some((item) => item.slug === vehicle.slug) && (
          <option value="" disabled>
            Selecione uma unidade
          </option>
        )}
        {units.map((item) => (
          <option key={item.slug} value={item.slug}>
            {formatKm(item.mileage)} — {formatBRL(item.price)}
          </option>
        ))}
      </Select>
    </section>
  );
}
