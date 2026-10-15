import { filterKeys } from './filterOptions';
import { validCatalogSort } from './catalogSort';

const queryKeys = ['search', ...filterKeys, 'sortBy'];

function numericParam(value, integer = false) {
  if (!value || !(integer ? /^\d+$/ : /^\d+(\.\d{1,2})?$/).test(value)) return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number <= Number.MAX_SAFE_INTEGER ? String(number) : undefined;
}

export function readCatalogLocation(searchParams) {
  const params = {};
  for (const key of ['search', 'brand', 'model']) {
    const value = searchParams.get(key)?.trim();
    if (value) params[key] = value;
  }
  for (const key of ['minPrice', 'maxPrice', 'minYear', 'maxYear']) {
    const raw = searchParams.get(key)?.trim();
    const value = numericParam(raw, key.endsWith('Year'));
    if (value !== undefined && (!key.endsWith('Year') || /^\d{4}$/.test(value))) params[key] = value;
  }
  for (const [min, max] of [['minPrice', 'maxPrice'], ['minYear', 'maxYear']]) {
    if (params[min] !== undefined && params[max] !== undefined && Number(params[min]) > Number(params[max])) {
      delete params[min];
      delete params[max];
    }
  }
  const sort = validCatalogSort(searchParams.get('sortBy'));
  if (sort !== 'recent') params.sortBy = sort;
  const page = Number(numericParam(searchParams.get('page')?.trim(), true) || 0);
  return { params, page };
}

export function updateCatalogLocation(current, changes, { resetPage = true } = {}) {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(changes)) {
    if (![...queryKeys, 'page'].includes(key)) continue;
    if (value === undefined || value === null || value === '') next.delete(key);
    else next.set(key, String(value));
  }
  if (resetPage) next.delete('page');
  const { params, page } = readCatalogLocation(next);
  for (const key of queryKeys) {
    if (params[key] !== undefined) next.set(key, params[key]);
    else next.delete(key);
  }
  if (page > 0) next.set('page', String(page));
  else next.delete('page');
  return next;
}
