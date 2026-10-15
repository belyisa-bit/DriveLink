import photoData from './catalogPhotoData.json';

const assets = import.meta.glob('../../assets/vehicles/*.{jpg,jpeg,png}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export function getCatalogPhoto(brand, model, year) {
  const photo = photoData.find(
    (item) =>
      item.brand === brand &&
      item.model === model &&
      Number(year) >= item.minYear &&
      Number(year) <= item.maxYear,
  );
  if (!photo) return null;
  const url = assets[`../../assets/vehicles/${photo.file}`];
  return url ? { ...photo, url } : null;
}
