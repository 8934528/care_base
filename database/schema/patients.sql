CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_ref VARCHAR(20) UNIQUE NOT NULL,   -- e.g. PAT-2026-0001

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20) UNIQUE,
    gender VARCHAR(10),
    date_of_birth DATE,

    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,

    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),

    medical_history TEXT,   -- allergies, chronic diseases, etc.

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_id_number ON patients(id_number);
CREATE INDEX idx_patients_name ON patients(first_name, last_name);
CREATE INDEX idx_patients_ref ON patients(patient_ref);
