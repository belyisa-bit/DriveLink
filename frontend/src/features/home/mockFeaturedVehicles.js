import corolla from '../../assets/vehicles/toyota-corolla-demo.webp';
import compass from '../../assets/vehicles/jeep-compass-hero.webp';
import onix from '../../assets/vehicles/chevrolet-onix-demo.webp';

export const mockFeaturedVehicles = [
  { id: 1, brand: 'Toyota', model: 'Corolla', slug: 'toyota-corolla-2022', year: 2022, mileage: 38000, price: 142900, mainImageUrl: corolla, featured: true, status: 'DISPONIVEL' },
  { id: 2, brand: 'Jeep', model: 'Compass', slug: 'jeep-compass-2023', year: 2023, mileage: 27000, price: 169900, mainImageUrl: compass, featured: true, status: 'DISPONIVEL' },
  { id: 3, brand: 'Chevrolet', model: 'Onix', slug: 'chevrolet-onix-2023', year: 2023, mileage: 31000, price: 78900, mainImageUrl: onix, featured: true, status: 'DISPONIVEL' },
];
