CREATE TABLE leads (
    id BIGSERIAL PRIMARY KEY,

    name VARCHAR(120) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) NOT NULL,

    vehicle_id BIGINT,

    contact_preference VARCHAR(20) NOT NULL,

    message TEXT,

    lgpd_consent BOOLEAN NOT NULL DEFAULT FALSE,
    lgpd_consent_at TIMESTAMP,

    source VARCHAR(30) NOT NULL DEFAULT 'FORMULARIO',
    status VARCHAR(20) NOT NULL DEFAULT 'NOVO',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_leads_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id)
        ON DELETE SET NULL
);

CREATE INDEX idx_leads_email
    ON leads(email);

CREATE INDEX idx_leads_status
    ON leads(status);

CREATE INDEX idx_leads_created_at
    ON leads(created_at);

CREATE INDEX idx_leads_vehicle_id
    ON leads(vehicle_id);