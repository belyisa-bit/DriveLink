import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

describe('Campos compartilhados', () => {
  it('associa label, ajuda e erro ao input e encaminha a referência', () => {
    const ref = createRef();
    render(<Input ref={ref} label="Nome completo" name="name" required hint="Informe nome e sobrenome." error="Nome obrigatório." />);
    const input = screen.getByRole('textbox', { name: 'Nome completo' });
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Informe nome e sobrenome. Nome obrigatório.');
  });

  it('mantém IDs distintos mesmo com campos de mesmo nome', () => {
    render(<><Input label="Nome do comprador" name="name" /><Input label="Nome do responsável" name="name" /></>);
    expect(screen.getByLabelText('Nome do comprador').id).not.toBe(screen.getByLabelText('Nome do responsável').id);
  });

  it('permite selecionar uma opção e propaga a alteração', () => {
    const onChange = vi.fn();
    render(<Select label="Marca" defaultValue="" onChange={onChange}><option value="">Todas</option><option value="jeep">Jeep</option></Select>);
    const select = screen.getByRole('combobox', { name: 'Marca' });
    fireEvent.change(select, { target: { value: 'jeep' } });
    expect(select).toHaveValue('jeep');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('preserva descrições externas e estado desabilitado', () => {
    render(<><p id="context">Selecione uma marca primeiro.</p><Select label="Modelo" disabled hint="Opções carregadas do estoque." aria-describedby="context"><option>Todos</option></Select></>);
    const select = screen.getByRole('combobox', { name: 'Modelo' });
    expect(select).toBeDisabled();
    expect(select).toHaveAccessibleDescription('Selecione uma marca primeiro. Opções carregadas do estoque.');
  });
});
