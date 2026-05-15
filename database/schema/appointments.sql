CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    department VARCHAR(100),
    reason TEXT,
    status VARCHAR(30) DEFAULT 'Scheduled',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_appointments_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_appointments_created_by
    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

CREATE INDEX idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX idx_appointments_status
ON appointments(status);
