// Telefones nacionais com DDD: até 11 dígitos, sem código do país.
export function unmaskPhone(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 11);
}

export function maskPhone(value) {
  const digits = unmaskPhone(value);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;

  const areaCode = digits.slice(0, 2);
  const localNumber = digits.slice(2);
  const prefixLength = digits.length === 11 ? 5 : 4;
  const prefix = localNumber.slice(0, prefixLength);
  const suffix = localNumber.slice(prefixLength);

  return `(${areaCode}) ${prefix}${suffix ? `-${suffix}` : ''}`;
}
