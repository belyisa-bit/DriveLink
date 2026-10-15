export function groupCatalogVehicles(vehicles, sort = 'recent') {
  const groups = new Map();
  for (const vehicle of vehicles) {
    const key = JSON.stringify([vehicle.brand, vehicle.model]);
    if (!groups.has(key)) groups.set(key, { key, brand: vehicle.brand, model: vehicle.model, vehicles: [] });
    groups.get(key).vehicles.push(vehicle);
  }
  const result = [...groups.values()].map((group) => ({
    ...group,
    price: Math.min(...group.vehicles.map((vehicle) => vehicle.price)),
    mileage: Math.min(...group.vehicles.map((vehicle) => vehicle.mileage)),
    latest: Math.max(...group.vehicles.map((vehicle) => Date.parse(vehicle.createdAt) || 0)),
    years: [...new Set(group.vehicles.map((vehicle) => vehicle.year))].sort((a, b) => b - a),
  }));
  const compare = {
    price_asc: (a, b) => a.price - b.price,
    price_desc: (a, b) => b.price - a.price,
    mileage_asc: (a, b) => a.mileage - b.mileage,
    recent: (a, b) => b.latest - a.latest,
  };
  return result.sort(compare[sort] || compare.recent);
}
