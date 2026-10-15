import { mockCatalogVehicles } from '../catalog/mockCatalogVehicles';

// Complemento fictício para a tela local. Não altera os dados nem os preços do catálogo.
// Campos técnicos e selos que não foram cadastrados não são inventados.
export const mockVehicleDetails = mockCatalogVehicles.map((vehicle) => ({
  ...vehicle,
  description: `${vehicle.brand} ${vehicle.model}, ano ${vehicle.year}${vehicle.color ? `, na cor ${vehicle.color.toLowerCase()}` : ''}, com ${new Intl.NumberFormat('pt-BR').format(vehicle.mileage)} km. Consulte nossa equipe para conhecer esta unidade, confirmar seus equipamentos e agendar uma visita.`,
  images: vehicle.mainImageUrl
    ? [
        {
          id: `photo-${vehicle.id}`,
          url: vehicle.mainImageUrl,
          displayOrder: 0,
          isMain: true,
          credit: vehicle.imageCredit,
        },
      ]
    : [],
  features: [],
}));
