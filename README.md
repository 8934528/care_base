# CareBase

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512bd4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/download)
[![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Makefile](https://img.shields.io/badge/Makefile-000000?style=for-the-badge&logo=gnu-make&logoColor=white)](https://www.gnu.org/software/make/)

CareBase is an integrated patient data capturing and workflow management system designed for healthcare environments.

## Overview

CareBase streamlines patient registration, medical records (SOAP format), appointment scheduling, and outpatient triage queueing. It prioritises patient confidentiality, data integrity, and role-based access control.

## Key Principles

- **Data Protection**: Guided by South African health data principles (POPIA and National Health Act).
- **Clean Database**: No fake or demo patient records. The patient registry starts empty and is populated only by authorised healthcare employees.
- **Automated Schema Initialization**: Safe, idempotent database schema setup and migrations on startup.
- **Modular Design**: Structured backend layers and separated frontend stylesheets.

## Tech Stack

- **Backend**: ASP.NET Core (.NET 8) Web API with Entity Framework Core
- **Frontend**: React 19 + TypeScript + Vite + Bootstrap 5 + Lucide Icons
- **Database**: PostgreSQL (Database name: `carebase`)
- **Security**: JWT authentication, BCrypt password hashing, role-based authorization

## Project Structure

- `backend/`: ASP.NET Core Web API, Core domain models, migrations, and infrastructure.
- `frontend/`: React + TypeScript UI application with modular CSS under `src/styles/`.
- `policies/`: Healthcare data protection and access incident policies.
- `database/`: Database schema definitions and SQL scripts.
- `docs/`: Setup, architecture, and contribution guides.

## Quick Start

1. Install and start PostgreSQL.
2. Create the initial `carebase` database in PostgreSQL:
   ```sql
   CREATE DATABASE carebase;
   ```
3. Copy `.env.example` to `.env` and fill in your PostgreSQL credentials.
4. Run the backend and frontend:
   ```bash
   make run
   ```
   Or refer to [docs/SETUP.md](file:///c:/Users/Mihlali/Desktop/care_base/docs/SETUP.md) for step-by-step instructions.
