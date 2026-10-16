CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    version VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    manufacture_year INT NOT NULL,
    mileage INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    color VARCHAR(30) NOT NULL,
    fuel VARCHAR(30) NOT NULL,
    transmission VARCHAR(30) NOT NULL,
    engine VARCHAR(30) NOT NULL,
    body_type VARCHAR(30) NOT NULL,
    doors INT NOT NULL,
    plate_ending VARCHAR(5) NOT NULL,
    has_warranty BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    single_owner BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'DISPONIVEL',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehicle_images (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_main BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE vehicle_features (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL
);

CREATE INDEX idx_vehicles_brand_model ON vehicles(brand, model);
CREATE INDEX idx_vehicles_price ON vehicles(price);
CREATE INDEX idx_vehicles_status ON vehicles(status);
