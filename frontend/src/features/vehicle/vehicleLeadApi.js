import { api } from '../../lib/axios';
import { usingMockCatalog } from '../catalog/catalogApi';

export async function sendVehicleInterest(vehicle, values) {
  // IDs do catálogo local não podem ser enviados ao backend real.
  if (usingMockCatalog) return { simulated: true };
  if (!Number.isSafeInteger(vehicle.id) || vehicle.id <= 0)
    throw new Error('Referência inválida do veículo.');
  const { data } = await api.post('/leads', {
    name: values.name,
    phone: values.phone,
    email: values.email,
    vehicleId: vehicle.id,
    contactPreference: values.contactPreference,
    message: values.message || '',
    lgpdConsent: values.lgpdConsent,
    source: 'DETALHE_VEICULO',
  });
  if (data?.id == null)
    throw new Error('Resposta inválida ao enviar interesse.');
  return { simulated: false, id: data.id };
}
