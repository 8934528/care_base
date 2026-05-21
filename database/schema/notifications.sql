CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT,
    notification_type VARCHAR(50),
    -- Reminder | Confirmation | MissedAppointment
    channel VARCHAR(30),
    -- SMS | WhatsApp
    recipient VARCHAR(30),
    message TEXT,
    status VARCHAR(30) DEFAULT 'Pending',
    -- Pending | Sent | Failed
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_notification_appointment
    FOREIGN KEY (appointment_id)
    REFERENCES appointments(id)
);

CREATE INDEX idx_notifications_patient ON notifications(patient_id);
CREATE INDEX idx_notifications_status ON notifications(status);
