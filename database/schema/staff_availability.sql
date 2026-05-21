CREATE TABLE staff_availability (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL, -- 0=Sunday .. 6=Saturday (matches .NET DayOfWeek)
    UNIQUE (user_id, day_of_week)
);

CREATE INDEX idx_staff_availability_day ON staff_availability(day_of_week);
