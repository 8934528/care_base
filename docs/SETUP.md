# Setup Guide

Follow these steps to set up and run CareBase on your local machine.

## Prerequisites

- **.NET 8 SDK**: [Download .NET 8](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+ & npm**: [Download Node.js](https://nodejs.org/)
- **PostgreSQL 15+**: [Download PostgreSQL](https://www.postgresql.org/download/)
- **Make** (optional, for running convenience commands)

---

## 1. Database Setup

CareBase uses PostgreSQL. The database name must always be `carebase`.

1. Ensure your PostgreSQL server is installed and running.
2. Connect to your PostgreSQL instance using `psql`, pgAdmin, or your preferred SQL tool.
3. Manually create the `carebase` database:

```sql
CREATE DATABASE carebase;
```

> **Note:** The application will not automatically create PostgreSQL server instances or database users. When the application starts, it connects to PostgreSQL, checks that the `carebase` database exists, creates required tables using EF Core migrations, and seeds essential roles and the default administrator. It does not seed fake or demo patients.

---

## 2. Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your database and system settings in `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=carebase
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Authentication
JWT_KEY=your_secure_random_key_min_32_chars
JWT_ISSUER=CareBaseAPI
JWT_AUDIENCE=CareBaseClient

# Twilio SMS / WhatsApp (Optional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
TWILIO_WHATSAPP_NUMBER=
```

---

## 3. Running the Application

### Option A: Using Two Terminals

**Terminal 1 — Backend API:**
```bash
cd backend/CareBase.API
dotnet restore
dotnet run
```
The backend API runs at `http://localhost:5076` (Swagger documentation at `http://localhost:5076/swagger`).

**Terminal 2 — Frontend UI:**
```bash
cd frontend
npm install
npm run dev
```
The frontend application runs at `http://localhost:5173`.

### Option B: Using the Makefile

If you have `make` installed:

```bash
# Display help and available commands
make help

# Run both backend and frontend together
make run
```

---

## 4. Initial System Sign-In

On first startup, the database is automatically initialized with the default administrator account:

- **Email**: `admin@carebase.com`
- **Password**: `Admin@123`

The administrator can then log in, review facility departments, and provision staff accounts (Managers, Doctors, Nurses, and Clerks).

Patients must only be registered through the patient registration screen by authorised staff members.
