CREATE TABLE medical_records (
    id SERIAL PRIMARY KEY,

    patient_id INT NOT NULL,

    doctor_id INT NOT NULL,

    queue_id INT,

    visit_reference VARCHAR(30) UNIQUE NOT NULL,

    visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- SOAP STRUCTURE
    subjective TEXT,      -- Symptoms / complaints
    objective TEXT,       -- Observations / vitals
    assessment TEXT,      -- Diagnosis
    plan TEXT,            -- Treatment plan

    diagnosis_code VARCHAR(50),

    prescription TEXT,

    blood_pressure VARCHAR(20),
    heart_rate VARCHAR(20),
    temperature VARCHAR(20),
    oxygen_level VARCHAR(20),
    weight VARCHAR(20),
    height VARCHAR(20),

    follow_up_date DATE,

    status VARCHAR(30) DEFAULT 'Open',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_record_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_record_doctor
    FOREIGN KEY (doctor_id)
    REFERENCES users(id),

    CONSTRAINT fk_record_queue
    FOREIGN KEY (queue_id)
    REFERENCES queue(id)
);

CREATE INDEX idx_medical_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_doctor ON medical_records(doctor_id);
CREATE INDEX idx_medical_visit_date ON medical_records(visit_date);
