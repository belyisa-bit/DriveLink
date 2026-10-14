import { formatBRL, formatKm } from '../lib/formatters';

describe('Formatação de valores', () => {
  it('formata reais com milhares e centavos', () => {
    expect(formatBRL(142900).replace(/\s/g, ' ')).toBe('R$ 142.900,00');
    expect(formatBRL('124900.5').replace(/\s/g, ' ')).toBe('R$ 124.900,50');
    expect(formatBRL(0).replace(/\s/g, ' ')).toBe('R$ 0,00');
  });

  it('formata quilometragem sem casas decimais', () => {
    expect(formatKm(38000)).toBe('38.000 km');
    expect(formatKm('27000')).toBe('27.000 km');
    expect(formatKm(0)).toBe('0 km');
  });

  it.each([null, undefined, '', ' ', 'abc', NaN, Infinity, -1, false])('não exibe um número enganoso para %s', (value) => {
    expect(formatBRL(value)).toBe('—');
    expect(formatKm(value)).toBe('—');
  });
});
