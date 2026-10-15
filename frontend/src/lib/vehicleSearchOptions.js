// Compartilhadas entre a busca rápida da Home e os filtros do estoque.
export const priceRanges = [
  { value: '', label: 'Qualquer valor' },
  { value: 'under100', label: 'Até R$ 100.000', maxPrice: '100000' },
  { value: '100to150', label: 'R$ 100.000–150.000', minPrice: '100000', maxPrice: '150000' },
  { value: 'over150', label: 'Acima de R$ 150.000', minPrice: '150000.01' },
];
