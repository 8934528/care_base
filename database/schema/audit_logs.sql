CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INT,
    action VARCHAR(150) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(100),
    ip_address VARCHAR(100),
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
);

CREATE INDEX idx_audit_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_action
ON audit_logs(action);

CREATE INDEX idx_audit_created
ON audit_logs(created_at);
