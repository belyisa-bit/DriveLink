import { mockCatalogVehicles } from '../catalog/mockCatalogVehicles';

export const mockVehicleDetails = mockCatalogVehicles.map((vehicle) => ({
  ...vehicle,
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
}));
