import { priceRanges } from '../../lib/vehicleSearchOptions';

export const filterKeys = ['brand', 'model', 'minYear', 'maxYear', 'minPrice', 'maxPrice'];

export function availablePriceRanges(options) {
  if (options?.minPrice == null || options?.maxPrice == null) return [];
  const min = Number(options.minPrice);
  const max = Number(options.maxPrice);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  return priceRanges.filter((range) => range.value).map((range) => ({
    value: `${range.minPrice || ''}:${range.maxPrice || ''}`,
    label: range.label,
    min: range.minPrice ? Number(range.minPrice) : 0,
    max: range.maxPrice ? Number(range.maxPrice) : Infinity,
  })).filter((range) => min <= range.max && max >= range.min);
}
