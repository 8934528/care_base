CREATE TABLE queue (
    id SERIAL PRIMARY KEY,
    queue_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id INT NOT NULL,
    patient_ref VARCHAR(30) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Normal',
    status VARCHAR(20) DEFAULT 'Waiting',
    assigned_to INT,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_time TIMESTAMP,
    completed_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_queue_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_queue_assigned_user
    FOREIGN KEY (assigned_to)
    REFERENCES users(id)
);

CREATE INDEX idx_queue_status
ON queue(status);

CREATE INDEX idx_queue_priority
ON queue(priority);

CREATE INDEX idx_queue_checkin
ON queue(check_in_time);
