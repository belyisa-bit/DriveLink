import { useSearchParams } from 'react-router-dom';
import { readCatalogLocation, updateCatalogLocation } from './catalogLocation';
import { filterKeys } from './filterOptions';

export function useCatalogLocation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { params, page } = readCatalogLocation(searchParams);

  function update(changes, options) {
    const next = updateCatalogLocation(searchParams, changes, options);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: options?.replace || false });
  }

  return {
    params,
    page,
    filtersKey: JSON.stringify(filterKeys.map((key) => params[key] || '')),
    search: (value) => update({ search: value.trim() }),
    applyFilters: (filters) => update(Object.fromEntries(filterKeys.map((key) => [key, filters[key]]))),
    sort: (value) => update({ sortBy: value }),
    setPage: (value, options) => update({ page: value }, { ...options, resetPage: false }),
  };
}
