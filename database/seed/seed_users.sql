INSERT INTO users (
    full_name,
    email,
    password_hash,
    role_id
)
VALUES
(
    'System Administrator',
    'admin@carebase.com',
    '$2a$11$8M6Lk9x7wF3zjVQm2P7A4OKeN1zB5fKQhT2x0K7r8x9LQYwQjM7fS',
    1
),
(
    'Dr John Smith',
    'doctor@carebase.com',
    '$2a$11$8M6Lk9x7wF3zjVQm2P7A4OKeN1zB5fKQhT2x0K7r8x9LQYwQjM7fS',
    2
),
(
    'Nurse Mary',
    'nurse@carebase.com',
    '$2a$11$8M6Lk9x7wF3zjVQm2P7A4OKeN1zB5fKQhT2x0K7r8x9LQYwQjM7fS',
    3
),
(
    'Reception Clerk',
    'clerk@carebase.com',
    '$2a$11$8M6Lk9x7wF3zjVQm2P7A4OKeN1zB5fKQhT2x0K7r8x9LQYwQjM7fS',
    4
);
