CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    blood_pressure VARCHAR(20),
    temperature VARCHAR(20),
    weight VARCHAR(20),
    doctor_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medical_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_medical_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES users(id)
);

CREATE INDEX idx_medical_patient
ON medical_records(patient_id);

CREATE INDEX idx_medical_visit_date
ON medical_records(visit_date);
