CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,

    appointment_ref VARCHAR(30) UNIQUE NOT NULL,

    patient_id INT NOT NULL,

    doctor_id INT NOT NULL,

    appointment_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    appointment_type VARCHAR(50),

    reason TEXT,

    status VARCHAR(30) DEFAULT 'Scheduled',
    -- Scheduled | Confirmed | Completed | Cancelled | Missed

    priority VARCHAR(20) DEFAULT 'Normal',

    notes TEXT,

    created_by INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_appointment_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES users(id),

    CONSTRAINT fk_appointment_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
);

CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
