import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ToastProvider } from '../components/Toast';
import { useToast } from '../lib/toast';

function Trigger() {
  const { notify } = useToast();
  return <button onClick={() => notify('Pré-cadastro enviado.', { variant: 'success', duration: 5000 })}>Enviar</button>;
}

describe('Toast', () => {
  afterEach(() => vi.useRealTimers());

  it('anuncia a mensagem e permite fechar a notificação', () => {
    render(<ToastProvider><Trigger /></ToastProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    expect(screen.getByRole('status')).toHaveTextContent('Pré-cadastro enviado.');
    fireEvent.click(screen.getByRole('button', { name: 'Fechar notificação' }));
    expect(within(screen.getByRole('region', { name: 'Notificações' })).queryByText('Pré-cadastro enviado.')).not.toBeInTheDocument();
  });

  it('remove a notificação após o prazo configurado', () => {
    vi.useFakeTimers();
    render(<ToastProvider><Trigger /></ToastProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Enviar' }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.queryByRole('button', { name: 'Fechar notificação' })).not.toBeInTheDocument();
  });
});
