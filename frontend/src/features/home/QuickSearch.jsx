import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Select } from '../../components/Select';
import { getBrandModels, getVehicleFilters } from './vehicleFilters';

const priceRanges = [
  { value: '', label: 'Qualquer valor' },
  { value: 'under100', label: 'Até R$ 100.000', maxPrice: '100000' },
  { value: '100to150', label: 'R$ 100.000–150.000', minPrice: '100000', maxPrice: '150000' },
  { value: 'over150', label: 'Acima de R$ 150.000', minPrice: '150000.01' },
];

export function QuickSearch() {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const navigate = useNavigate();
  const filters = useQuery({ queryKey: ['vehicles', 'filters'], queryFn: getVehicleFilters, staleTime: 300000 });
  const models = useQuery({
    queryKey: ['vehicles', 'models', brand],
    queryFn: (context) => getBrandModels(brand, context),
    enabled: Boolean(brand),
    staleTime: 300000,
  });

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (brand && !models.isError && models.data?.includes(model)) params.set('model', model);
    const range = priceRanges.find((option) => option.value === priceRange);
    if (range?.minPrice) params.set('minPrice', range.minPrice);
    if (range?.maxPrice) params.set('maxPrice', range.maxPrice);
    navigate(`/estoque${params.size ? `?${params}` : ''}`);
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Busca rápida de veículos" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="grid items-end gap-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <Select label="Marca" name="brand" value={brand} disabled={filters.isPending || filters.isError} onChange={(event) => { setBrand(event.target.value); setModel(''); }}>
          <option value="">{filters.isPending ? 'Carregando marcas…' : 'Todas'}</option>
          {(filters.data?.brands || []).map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Modelo" name="model" value={model} disabled={!brand || models.isPending || models.isError} onChange={(event) => setModel(event.target.value)}>
          <option value="">{brand && models.isPending ? 'Carregando modelos…' : 'Todos'}</option>
          {(models.data || []).map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Faixa de preço" name="priceRange" value={priceRange} onChange={(event) => setPriceRange(event.target.value)}>
          {priceRanges.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </Select>
        <Button type="submit" className="w-full"><Search size={19} aria-hidden="true" />Buscar veículos</Button>
      </div>
      {!brand && <p className="mt-3 text-xs text-slate-600">Selecione uma marca para consultar os modelos disponíveis.</p>}
      {(filters.isError || (brand && models.isError)) && (
        <div role="status" className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <p>{filters.isError ? 'Não foi possível carregar as marcas. Você ainda pode buscar por preço.' : 'Não foi possível carregar os modelos. Você ainda pode buscar por marca e preço.'}</p>
          <button type="button" onClick={() => filters.isError ? filters.refetch() : models.refetch()} className="rounded font-semibold text-brand-hover underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Tentar novamente</button>
        </div>
      )}
    </form>
  );
}
