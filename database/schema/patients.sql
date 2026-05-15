CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_ref VARCHAR(30) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(30) UNIQUE,
    gender VARCHAR(20),
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(150),
    address TEXT,
    emergency_contact_name VARCHAR(150),
    emergency_contact_phone VARCHAR(20),
    medical_history TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_ref
ON patients(patient_ref);

CREATE INDEX idx_patient_name
ON patients(first_name, last_name);

CREATE INDEX idx_patient_id_number
ON patients(id_number);
