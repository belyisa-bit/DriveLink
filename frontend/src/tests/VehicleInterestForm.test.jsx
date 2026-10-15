import {
  act,
  fireEvent,
  render as renderComponent,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { VehicleInterestForm } from '../features/vehicle-detail/VehicleInterestForm';
import { sendVehicleInterest } from '../features/vehicle-detail/vehicleLeadApi';

vi.mock('../features/vehicle-detail/vehicleLeadApi', () => ({
  sendVehicleInterest: vi.fn(),
}));
const vehicle = { id: 12, slug: 'fiat-argo-2024', status: 'DISPONIVEL' };
beforeEach(() => sendVehicleInterest.mockReset());
function render(ui) {
  return renderComponent(ui, { wrapper: MemoryRouter });
}
function fill() {
  fireEvent.change(screen.getByRole('textbox', { name: 'Nome completo' }), {
    target: { value: '  Maria Silva  ' },
  });
  fireEvent.change(
    screen.getByRole('textbox', { name: 'Telefone / WhatsApp' }),
    { target: { value: '11987654321' } },
  );
  fireEvent.change(screen.getByRole('textbox', { name: 'E-mail' }), {
    target: { value: 'maria@example.com' },
  });
}

it('valida dados e consentimento antes de enviar nome e telefone normalizados', async () => {
  sendVehicleInterest.mockResolvedValue({ simulated: false, id: 91 });
  render(<VehicleInterestForm vehicle={vehicle} />);
  expect(
    screen.getByRole('link', { name: 'Fazer pré-cadastro' }),
  ).toHaveAttribute('href', '/atendimento?vehicleSlug=fiat-argo-2024');
  expect(
    screen.getByText('Seus dados estão seguros com a Drivelink.'),
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Quero atendimento' }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  fireEvent.submit(screen.getByRole('form', { name: 'Interesse no veículo' }));
  expect(await screen.findByText('Informe seu nome.')).toBeInTheDocument();
  expect(sendVehicleInterest).not.toHaveBeenCalled();
  fill();
  expect(
    screen.getByRole('button', { name: 'Quero atendimento' }),
  ).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(
    await screen.findByText(
      'Autorize o uso dos seus dados para receber o contato.',
    ),
  ).toBeInTheDocument();
  expect(sendVehicleInterest).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('checkbox'));
  expect(
    screen.getByRole('button', { name: 'Quero atendimento' }),
  ).toBeEnabled();
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(
    await screen.findByText('Recebemos seu interesse!'),
  ).toBeInTheDocument();
  expect(sendVehicleInterest).toHaveBeenCalledWith(vehicle, {
    name: 'Maria Silva',
    phone: '11987654321',
    email: 'maria@example.com',
    contactPreference: 'WHATSAPP',
    message: '',
    lgpdConsent: true,
  });
});

it('bloqueia novamente ao apagar dados, informar e-mail inválido ou retirar o consentimento', async () => {
  render(<VehicleInterestForm vehicle={vehicle} />);
  fill();
  fireEvent.click(screen.getByRole('checkbox'));
  const button = screen.getByRole('button', { name: 'Quero atendimento' });
  expect(button).toBeEnabled();
  for (const [name, invalid, valid] of [
    ['Nome completo', '   ', 'Maria Silva'],
    ['Telefone / WhatsApp', '1198', '11987654321'],
    ['E-mail', 'maria@', 'maria@example.com'],
  ]) {
    const field = screen.getByRole('textbox', { name });
    fireEvent.change(field, { target: { value: invalid } });
    expect(button).toBeDisabled();
    fireEvent.submit(
      screen.getByRole('form', { name: 'Interesse no veículo' }),
    );
    await waitFor(() => expect(field).toHaveAttribute('aria-invalid', 'true'));
    expect(sendVehicleInterest).not.toHaveBeenCalled();
    fireEvent.change(field, { target: { value: valid } });
    expect(button).toBeEnabled();
  }
  fireEvent.click(screen.getByRole('checkbox'));
  expect(button).toBeDisabled();
  fireEvent.submit(screen.getByRole('form', { name: 'Interesse no veículo' }));
  expect(
    await screen.findByText(
      'Autorize o uso dos seus dados para receber o contato.',
    ),
  ).toBeInTheDocument();
  expect(sendVehicleInterest).not.toHaveBeenCalled();
});

it('preserva os dados após erro e permite nova tentativa', async () => {
  sendVehicleInterest.mockRejectedValueOnce({ response: { status: 429 } });
  sendVehicleInterest.mockResolvedValueOnce({ simulated: false, id: 92 });
  render(<VehicleInterestForm vehicle={vehicle} />);
  fill();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Muitas solicitações',
  );
  expect(screen.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
    'maria@example.com',
  );
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(
    await screen.findByText('Recebemos seu interesse!'),
  ).toBeInTheDocument();
});

it('impede envio duplicado enquanto a solicitação está em andamento', async () => {
  let complete;
  sendVehicleInterest.mockReturnValue(
    new Promise((resolve) => {
      complete = resolve;
    }),
  );
  render(<VehicleInterestForm vehicle={vehicle} />);
  fill();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(
    await screen.findByRole('button', { name: 'Enviando…' }),
  ).toBeDisabled();
  fireEvent.submit(screen.getByRole('form', { name: 'Interesse no veículo' }));
  await waitFor(() => expect(sendVehicleInterest).toHaveBeenCalledTimes(1));
  await act(async () => complete({ simulated: false, id: 93 }));
  expect(
    await screen.findByText('Recebemos seu interesse!'),
  ).toBeInTheDocument();
});

it('identifica testes locais e não oferece formulário para unidades indisponíveis', async () => {
  sendVehicleInterest.mockResolvedValue({ simulated: true });
  const view = render(<VehicleInterestForm vehicle={vehicle} />);
  fill();
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(screen.getByRole('button', { name: 'Quero atendimento' }));
  expect(
    await screen.findByText('Formulário de teste validado.'),
  ).toBeInTheDocument();
  expect(
    screen.queryByText('Recebemos seu interesse!'),
  ).not.toBeInTheDocument();
  view.rerender(
    <VehicleInterestForm
      key="vendido"
      vehicle={{ ...vehicle, status: 'VENDIDO' }}
    />,
  );
  expect(
    screen.queryByRole('button', { name: 'Quero atendimento' }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Ver estoque' })).toHaveAttribute(
    'href',
    '/estoque',
  );
});
