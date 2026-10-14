import { maskPhone, unmaskPhone } from '../lib/masks';

describe('Máscara de telefone', () => {
  it.each([
    ['', ''],
    ['1', '(1'],
    ['11', '(11'],
    ['119', '(11) 9'],
    ['119876', '(11) 9876'],
    ['1198765', '(11) 9876-5'],
    ['1198765432', '(11) 9876-5432'],
    ['11987654321', '(11) 98765-4321'],
    ['1134567890', '(11) 3456-7890'],
  ])('formata %s durante a digitação', (value, expected) => {
    expect(maskPhone(value)).toBe(expected);
  });

  it('aceita colar um telefone formatado sem duplicar a máscara', () => {
    expect(maskPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
    expect(unmaskPhone('(11) 98765-4321')).toBe('11987654321');
  });

  it('limita o campo a 11 dígitos e remove caracteres não numéricos', () => {
    expect(maskPhone('abc11987654321999')).toBe('(11) 98765-4321');
    expect(unmaskPhone('abc11987654321999')).toBe('11987654321');
    expect(maskPhone(null)).toBe('');
    expect(maskPhone(undefined)).toBe('');
  });
});
