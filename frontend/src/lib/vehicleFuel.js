const fuels = {
  FLEX: 'Flex',
  GASOLINA: 'Gasolina',
  ETANOL: 'Etanol',
  DIESEL: 'Diesel',
};

export function getVehicleFuelFact(fuel) {
  if (fuels[fuel]) return ['Combustível', fuels[fuel]];
  if (fuel === 'HIBRIDO') return ['Motorização', 'Híbrida'];
  if (fuel === 'ELETRICO') return ['Motorização', 'Elétrica'];
  return ['Combustível', null];
}
