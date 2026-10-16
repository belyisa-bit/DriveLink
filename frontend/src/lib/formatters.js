const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const mileageFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
});

function numericValue(value) {
  if (typeof value !== 'number' && typeof value !== 'string') return null;
  if (typeof value === 'string' && !value.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function formatBRL(value) {
  const number = numericValue(value);
  return number === null ? '—' : currencyFormatter.format(number);
}

export function formatKm(value) {
  const number = numericValue(value);
  return number === null ? '—' : `${mileageFormatter.format(number)} km`;
}
