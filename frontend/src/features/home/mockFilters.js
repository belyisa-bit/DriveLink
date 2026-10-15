// Dados de demonstração; este módulo é carregado somente no desenvolvimento.
const modelsByBrand = {
  Chevrolet: ['Onix', 'Onix Plus', 'Tracker', 'S10'],
  Citroën: ['C3', 'Aircross', 'C4 Cactus'],
  Fiat: ['Argo', 'Mobi', 'Strada', 'Toro'],
  Ford: ['Ka', 'Fiesta', 'EcoSport', 'Ranger'],
  Honda: ['City', 'Civic', 'Fit', 'HR-V'],
  Hyundai: ['HB20', 'HB20S', 'Creta', 'Tucson'],
  Jeep: ['Renegade', 'Compass', 'Commander'],
  Nissan: ['Kicks', 'Versa', 'Sentra', 'Frontier'],
  Peugeot: ['208', '2008', '308'],
  Renault: ['Kwid', 'Sandero', 'Logan', 'Duster'],
  Toyota: ['Corolla', 'Corolla Cross', 'Yaris', 'Hilux'],
  Volkswagen: ['Gol', 'Polo', 'Nivus', 'T-Cross', 'Virtus'],
};

export function mockVehicleFilters() {
  return { brands: Object.keys(modelsByBrand).sort((a, b) => a.localeCompare(b, 'pt-BR')) };
}

export function mockBrandModels(brand) {
  return [...(modelsByBrand[brand] || [])].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
