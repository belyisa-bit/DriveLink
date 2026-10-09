INSERT INTO vehicles (brand, model, version, slug, manufacture_year, mileage, price, color, fuel, transmission, engine, body_type, doors, plate_ending, has_warranty, description, single_owner, reviewed, featured, status) VALUES
('Jeep', 'Compass', '2.0 Longitude T270 4x2 Flex', 'jeep-compass-2023', 2023, 22000, 148900.00, 'Cinza', 'FLEX', 'AUTOMATICO', '1.3 Turbo', 'SUV', 4, '8', TRUE, 'Jeep Compass em estado impecável, todas as revisões feitas na concessionária.', TRUE, TRUE, TRUE, 'DISPONIVEL'),
('Toyota', 'Corolla', '2.0 Altis Premium Flex', 'toyota-corolla-2024', 2024, 12000, 162900.00, 'Branco', 'FLEX', 'CVT', '2.0 Direct Shift', 'SEDAN', 4, '3', TRUE, 'Corolla Altis completo com pacote de segurança Toyota Safety Sense.', TRUE, TRUE, TRUE, 'DISPONIVEL'),
('BMW', 'X1', '2.0 sDrive20i GP Turbo', 'bmw-x1-2022', 2022, 35000, 219900.00, 'Preto', 'GASOLINA', 'AUTOMATICO', '2.0 TwinPower', 'SUV', 4, '5', TRUE, 'BMW X1 com teto solar panorâmico, bancos em couro e revisada.', FALSE, TRUE, TRUE, 'DISPONIVEL'),
('Honda', 'Civic', '2.0 Touring Turbo', 'honda-civic-2021', 2021, 42000, 139900.00, 'Prata', 'GASOLINA', 'CVT', '1.5 Turbo', 'SEDAN', 4, '1', FALSE, 'Civic Touring em ótimo estado de conservação e consumo excelente.', TRUE, TRUE, FALSE, 'DISPONIVEL'),
('Volkswagen', 'T-Cross', '1.0 Highline 200 TSI', 'volkswagen-t-cross-2023', 2023, 18000, 119900.00, 'Azul', 'FLEX', 'AUTOMATICO', '1.0 TSI', 'SUV', 4, '9', TRUE, 'T-Cross com painel digital Active Info Display e sensor dianteiro e traseiro.', TRUE, TRUE, FALSE, 'DISPONIVEL'),
('Hyundai', 'Creta', '1.0 TGDI Ultimate', 'hyundai-creta-2024', 2024, 8000, 134900.00, 'Cinza', 'FLEX', 'AUTOMATICO', '1.0 Turbo', 'SUV', 4, '4', TRUE, 'Creta semileito com câmeras 360 graus e teto solar.', TRUE, TRUE, FALSE, 'DISPONIVEL');

-- Imagens do Jeep Compass
INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main) VALUES
(1, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf', 0, TRUE),
(1, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341', 1, FALSE);

-- Imagens do Corolla
INSERT INTO vehicle_images (vehicle_id, image_url, display_order, is_main) VALUES
(2, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb', 0, TRUE);

-- Opcionais do Compass
INSERT INTO vehicle_features (vehicle_id, name) VALUES
(1, 'Ar-condicionado digital dual zone'),
(1, 'Central multimídia de 10.1" com Apple CarPlay/Android Auto sem fio'),
(1, 'Bancos em couro'),
(1, 'Faróis em Full LED'),
(1, 'Piloto automático adaptativo');
