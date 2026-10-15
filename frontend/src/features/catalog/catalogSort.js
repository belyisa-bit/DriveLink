export const catalogSortOptions = [
  { value: 'recent', label: 'Mais recentes' },
  { value: 'price_asc', label: 'Menor preço' },
  { value: 'price_desc', label: 'Maior preço' },
  { value: 'mileage_asc', label: 'Menor km' },
];

export function validCatalogSort(value) {
  return catalogSortOptions.some((option) => option.value === value) ? value : 'recent';
}
