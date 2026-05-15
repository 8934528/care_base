# Project Structure

The project is organized into a distributed micro-monolith architecture, separating concerns between the backend, the frontend, and the database.

## CAREBASE – Full System Project Structure

```text
care_base/
│
├── frontend/                          # React + TypeScript UI Layer
├── backend/                           # ASP.NET Core Web API Layer
├── database/                          # PostgreSQL schema, scripts, migrations
│
└── README.md                          # System overview & setup guide
```

## 1. FRONTEND (React + TypeScript + Vite + Bootstrap)

```text
frontend/
│
├── public/
│   └── index.html
│
├── src/
│
│   ├── assets/                       # Images, icons, logos
│   ├── styles/                       # Global CSS / Bootstrap overrides
│   │
│   ├── components/                   # Reusable UI components
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   ├── Table/
│   │   ├── Modal/
│   │   ├── FormInputs/
│   │   └── Cards/
│   │
│   ├── pages/                        # Main system screens
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── Dashboard.tsx         # Reporting dashboard
│   │   │
│   │   ├── patients/
│   │   │   ├── PatientRegistration.tsx
│   │   │   ├── PatientProfile.tsx
│   │   │   └── PatientSearch.tsx
│   │   │
│   │   ├── records/
│   │   │   └── MedicalRecords.tsx
│   │   │
│   │   ├── appointments/
│   │   │   └── AppointmentScheduler.tsx
│   │   │
│   │   ├── queue/
│   │   │   └── QueueManagement.tsx
│   │   │
│   │   ├── notes/
│   │   │   └── DoctorNurseNotes.tsx
│   │   │
│   │   ├── reports/
│   │   │   └── Reports.tsx
│   │   │
│   │   └── notfound/
│   │       └── NotFound.tsx
│   │
│   ├── services/                    # API communication layer
│   │   ├── api.ts                   # Axios setup
│   │   ├── authService.ts
│   │   ├── patientService.ts
│   │   ├── appointmentService.ts
│   │   ├── queueService.ts
│   │   ├── recordsService.ts
│   │   └── reportService.ts
│   │
│   ├── context/                    # Global state (Auth, Roles, etc.)
│   │   ├── AuthContext.tsx
│   │   └── RoleContext.tsx
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   │
│   ├── routes/
│   │   └── AppRoutes.tsx
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   ├── types/                     # TypeScript interfaces
│   │   ├── Patient.ts
│   │   ├── Appointment.ts
│   │   ├── MedicalRecord.ts
│   │   ├── User.ts
│   │   └── Queue.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── package.json
└── vite.config.ts
```

## 2. BACKEND (ASP.NET Core Web API)

```text
backend/
│
├── care_base.API/                     # Main API project
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   ├── PatientsController.cs
│   │   ├── AppointmentsController.cs
│   │   ├── QueueController.cs
│   │   ├── MedicalRecordsController.cs
│   │   ├── NotesController.cs
│   │   ├── ReportsController.cs
│   │   └── AuditController.cs
│   │
│   ├── Middleware/
│   │   ├── JwtMiddleware.cs
│   │   ├── ExceptionMiddleware.cs
│   │   └── AuditLoggingMiddleware.cs
│   │
│   ├── Filters/
│   │   └── RoleAuthorizationFilter.cs
│   │
│   ├── Program.cs
│   └── appsettings.json
│
│
├── care_base.Core/                   # Business logic layer
│   ├── Entities/
│   │   ├── Patient.cs
│   │   ├── Appointment.cs
│   │   ├── MedicalRecord.cs
│   │   ├── QueueItem.cs
│   │   ├── User.cs
│   │   ├── Role.cs
│   │   └── AuditLog.cs
│   │
│   ├── Interfaces/
│   │   ├── IPatientService.cs
│   │   ├── IAppointmentService.cs
│   │   ├── IQueueService.cs
│   │   └── IAuthService.cs
│   │
│   └── Services/
│       ├── PatientService.cs
│       ├── AppointmentService.cs
│       ├── QueueService.cs
│       ├── AuthService.cs
│       └── ReportService.cs
│
│
├── care_base.Infrastructure/        # Data access layer
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   └── DbInitializer.cs
│   │
│   ├── Repositories/
│   │   ├── PatientRepository.cs
│   │   ├── AppointmentRepository.cs
│   │   ├── QueueRepository.cs
│   │   └── AuditRepository.cs
│   │
│   ├── Migrations/
│   │
│   └── Configurations/
│       └── EntityConfigurations.cs
│
│
├── care_base.Shared/                # Shared DTOs & helpers
│   ├── DTOs/
│   │   ├── PatientDto.cs
│   │   ├── AppointmentDto.cs
│   │   ├── MedicalRecordDto.cs
│   │   └── AuthDto.cs
│   │
│   ├── Enums/
│   │   ├── UserRole.cs
│   │   └── QueueStatus.cs
│   │
│   └── Helpers/
│       ├── JwtHelper.cs
│       └── ResponseWrapper.cs
│
│
└── CareBase.sln
```

## 3. DATABASE (PostgreSQL)

```text
database/
│
├── schema/
│   ├── users.sql
│   ├── roles.sql
│   ├── patients.sql
│   ├── appointments.sql
│   ├── medical_records.sql
│   ├── queue.sql
│   ├── notes.sql
│   └── audit_logs.sql
│
├── seed/
│   ├── seed_users.sql
│   ├── seed_roles.sql
│   └── seed_demo_patients.sql
│
└── migrations/   # EF Core or manual SQL migrations
```

## Component Responsibilities

### Backend

### Frontend

### PostgreSQL
