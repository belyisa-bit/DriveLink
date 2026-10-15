import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Car, LayoutGrid, Tag } from 'lucide-react';
import { Card } from '../../components/Card';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { getCatalogFilters, getCatalogModels, getCatalogYears } from './catalogApi';
import { availablePriceRanges } from './filterOptions';

export function CatalogFilters({ applied, onApply, onClear }) {
  const [brand, setBrand] = useState(applied.brand || '');
  const [model, setModel] = useState(applied.model || '');
  const [year, setYear] = useState(applied.minYear === applied.maxYear ? applied.minYear || '' : '');
  const [price, setPrice] = useState(applied.minPrice || applied.maxPrice ? `${applied.minPrice || ''}:${applied.maxPrice || ''}` : '');
  const options = useQuery({ queryKey: ['vehicles', 'catalog-filters'], queryFn: getCatalogFilters, staleTime: 300000 });
  const brands = options.data?.brands || [];
  const selectedBrand = brands.includes(brand) ? brand : '';
  const models = useQuery({ queryKey: ['vehicles', 'catalog-models', selectedBrand], queryFn: (context) => getCatalogModels(selectedBrand, context), enabled: Boolean(selectedBrand), staleTime: 300000 });
  const selectedModel = models.data?.includes(model) ? model : '';
  const yearOptions = useQuery({ queryKey: ['vehicles', 'catalog-years', selectedBrand, selectedModel], queryFn: (context) => getCatalogYears(selectedBrand, selectedModel, context), enabled: Boolean(selectedBrand && selectedModel), staleTime: 300000 });
  const years = yearOptions.data || [];
  const selectedYear = selectedModel && years.includes(Number(year)) ? String(year) : '';
  const prices = availablePriceRanges(options.data);

  function handleSubmit(event) {
    event.preventDefault();
    const [minPrice, maxPrice] = price.split(':');
    onApply({ brand: selectedBrand, model: selectedModel, minYear: selectedYear, maxYear: selectedYear, minPrice, maxPrice });
  }

  return (
    <Card as="aside" className="h-fit lg:p-6" aria-labelledby="catalog-filters-title">
      <h2 id="catalog-filters-title" className="mb-6 text-xl font-bold text-slate-950">Filtrar por</h2>
      <form aria-label="Filtros do estoque" onSubmit={handleSubmit} className="space-y-5">
        <Select label="Marca" icon={Car} value={selectedBrand} disabled={options.isPending || options.isError} onChange={(event) => { setBrand(event.target.value); setModel(''); setYear(''); }}>
          <option value="">Todos</option>
          {brands.map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Modelo" icon={LayoutGrid} value={selectedModel} disabled={!selectedBrand || models.isPending || models.isError} onChange={(event) => { setModel(event.target.value); setYear(''); }}>
          <option value="">Todos</option>
          {(models.data || []).map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Ano" icon={CalendarDays} value={selectedYear} disabled={!selectedModel || yearOptions.isPending || yearOptions.isError} onChange={(event) => setYear(event.target.value)}>
          <option value="">Todos</option>
          {years.map((value) => <option key={value} value={value}>{value}</option>)}
        </Select>
        <Select label="Faixa de preço" icon={Tag} value={price} disabled={options.isPending || options.isError} onChange={(event) => setPrice(event.target.value)}>
          <option value="">Qualquer valor</option>
          {price && !prices.some((range) => range.value === price) && <option value={price}>Faixa recebida da busca</option>}
          {prices.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </Select>
        {options.isError && <p role="status" className="text-sm text-red-700">Não foi possível carregar os filtros. <button type="button" onClick={() => options.refetch()} className="rounded underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">Tentar novamente</button></p>}
        {brand && models.isError && <p role="status" className="text-sm text-red-700">Não foi possível carregar os modelos. <button type="button" onClick={() => models.refetch()} className="rounded underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">Tentar novamente</button></p>}
        {selectedModel && yearOptions.isError && <p role="status" className="text-sm text-red-700">Não foi possível carregar os anos. <button type="button" onClick={() => yearOptions.refetch()} className="rounded underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">Tentar novamente</button></p>}
        <Button type="submit" disabled={options.isPending || options.isError || Boolean(selectedBrand && (models.isPending || models.isError)) || Boolean(selectedModel && (yearOptions.isPending || yearOptions.isError))} className="w-full">Aplicar filtros</Button>
        <button type="button" onClick={() => { setBrand(''); setModel(''); setYear(''); setPrice(''); onClear(); }} className="block w-full rounded py-2 text-sm font-semibold text-brand-hover underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">Limpar filtros</button>
      </form>
    </Card>
  );
}
