CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    medical_record_id INT,
    author_id INT NOT NULL,
    note_type VARCHAR(50),
    note_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notes_patient
    FOREIGN KEY (patient_id)
    REFERENCES patients(id),

    CONSTRAINT fk_notes_record
    FOREIGN KEY (medical_record_id)
    REFERENCES medical_records(id),

    CONSTRAINT fk_notes_author
    FOREIGN KEY (author_id)
    REFERENCES users(id)
);

CREATE INDEX idx_notes_patient
ON notes(patient_id);

CREATE INDEX idx_notes_author
ON notes(author_id);
