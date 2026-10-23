UPDATE vehicle_images image
SET image_url = '/vehicle-images/jeep-compass-2022-2025.jpg'
FROM vehicles vehicle
WHERE image.vehicle_id = vehicle.id
  AND vehicle.slug = 'jeep-compass-2023'
  AND image.is_main = TRUE;

UPDATE vehicle_images image
SET image_url = '/vehicle-images/toyota-corolla-2020-2025.jpg'
FROM vehicles vehicle
WHERE image.vehicle_id = vehicle.id
  AND vehicle.slug = 'toyota-corolla-2024'
  AND image.is_main = TRUE;

INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main)
SELECT vehicle.id, '/vehicle-images/honda-civic-2017-2021.jpg', 0, TRUE
FROM vehicles vehicle
WHERE vehicle.slug = 'honda-civic-2021'
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_images image WHERE image.vehicle_id = vehicle.id
  );

INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main)
SELECT vehicle.id, '/vehicle-images/volkswagen-t-cross-2019-2024.jpg', 0, TRUE
FROM vehicles vehicle
WHERE vehicle.slug = 'volkswagen-t-cross-2023'
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_images image WHERE image.vehicle_id = vehicle.id
  );

INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main)
SELECT vehicle.id, '/vehicle-images/hyundai-creta-2022-2024.png', 0, TRUE
FROM vehicles vehicle
WHERE vehicle.slug = 'hyundai-creta-2024'
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_images image WHERE image.vehicle_id = vehicle.id
  );

INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main)
SELECT vehicle.id, 'https://images.unsplash.com/photo-1555215695-3004980ad54e', 0, TRUE
FROM vehicles vehicle
WHERE vehicle.slug = 'bmw-x1-2022'
  AND NOT EXISTS (
      SELECT 1 FROM vehicle_images image WHERE image.vehicle_id = vehicle.id
  );
