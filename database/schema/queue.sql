CREATE TABLE queue (
    id SERIAL PRIMARY KEY,

    queue_number VARCHAR(20) UNIQUE NOT NULL,   -- Q-2026-0001

    patient_id INT NOT NULL,
    patient_ref VARCHAR(20) NOT NULL,

    priority VARCHAR(20) DEFAULT 'Normal', -- Normal | Priority | Emergency

    status VARCHAR(20) DEFAULT 'Waiting',  -- Waiting | InProgress | Completed | Skipped

    assigned_to VARCHAR(150), -- Doctor/Nurse name

    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_time TIMESTAMP,
    completed_time TIMESTAMP
);

CREATE INDEX idx_queue_status ON queue(status);
CREATE INDEX idx_queue_priority ON queue(priority);
CREATE INDEX idx_queue_number ON queue(queue_number);
