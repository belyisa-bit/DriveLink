import { Select } from '../../components/Select';
import { catalogSortOptions } from './catalogSort';

export function CatalogToolbar({ total, models, loading, error, sort, onSort }) {
  const count = new Intl.NumberFormat('pt-BR').format(total || 0);
  const message = loading ? 'Consultando estoque…' : error ? 'Resultados indisponíveis' : `${count} ${total === 1 ? 'veículo encontrado' : 'veículos encontrados'}`;

  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div aria-live="polite" aria-atomic="true"><h2 className="text-lg font-bold text-slate-950">{message}</h2>{!loading && !error && <p className="mt-1 text-sm text-slate-600">{models} {models === 1 ? 'modelo' : 'modelos'}</p>}</div>
      <div className="flex w-full items-center gap-3 sm:w-auto">
        <label htmlFor="catalog-sort" className="shrink-0 text-sm text-slate-600">Ordenar por</label>
        <Select id="catalog-sort" value={sort} onChange={(event) => onSort(event.target.value)} wrapperClassName="w-full sm:w-44" className="min-h-10 py-2">
          {catalogSortOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </Select>
      </div>
    </div>
  );
}
