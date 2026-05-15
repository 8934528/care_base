INSERT INTO patients (
    patient_ref,
    first_name,
    last_name,
    id_number,
    gender,
    date_of_birth,
    phone,
    email,
    address,
    emergency_contact_name,
    emergency_contact_phone,
    medical_history
)
VALUES
(
    'PAT-2026-0001',
    'Sipho',
    'Nkosi',
    '9901015800081',
    'Male',
    '1999-01-01',
    '0712345678',
    'sipho@example.com',
    'Khayelitsha, Cape Town',
    'Nomsa Nkosi',
    '0721112222',
    'Asthma'
),
(
    'PAT-2026-0002',
    'Ayanda',
    'Mokoena',
    '0105050800084',
    'Female',
    '2001-05-05',
    '0734445555',
    'ayanda@example.com',
    'Gugulethu, Cape Town',
    'Thabo Mokoena',
    '0743334444',
    'Diabetes'
),
(
    'PAT-2026-0003',
    'Lwazi',
    'Dlamini',
    '9507075800087',
    'Male',
    '1995-07-07',
    '0767778888',
    'lwazi@example.com',
    'Langa, Cape Town',
    'Busi Dlamini',
    '0789990000',
    'Hypertension'
);
