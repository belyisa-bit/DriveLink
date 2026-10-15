import { getCatalogPhoto } from '../catalog/catalogPhotos';

function withPhoto(vehicle) {
  const photo = getCatalogPhoto(vehicle.brand, vehicle.model, vehicle.year);
  return {
    ...vehicle,
    mainImageUrl: photo?.url || null,
    color: photo?.color || null,
    imageCredit: photo
      ? {
          sourceUrl: photo.sourceUrl,
          author: photo.author,
          license: photo.license,
          licenseUrl: photo.licenseUrl,
        }
      : null,
  };
}

export const mockFeaturedVehicles = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Corolla',
    slug: 'toyota-corolla-2022',
    year: 2022,
    mileage: 38000,
    price: 142900,
    featured: true,
    status: 'DISPONIVEL',
  },
  {
    id: 2,
    brand: 'Jeep',
    model: 'Compass',
    slug: 'jeep-compass-2023',
    year: 2023,
    mileage: 27000,
    price: 169900,
    featured: true,
    status: 'DISPONIVEL',
  },
  {
    id: 3,
    brand: 'Chevrolet',
    model: 'Onix',
    slug: 'chevrolet-onix-2023',
    year: 2023,
    mileage: 31000,
    price: 78900,
    featured: true,
    status: 'DISPONIVEL',
  },
].map(withPhoto);
