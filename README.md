# care_base

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512bd4?style=for-the-badge&logo=dotnet)](https://dotnet.microsoft.com/download)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

Digital patient data capturing and workflow management system for healthcare environments.

## Overview

CareBase is a modern, integrated healthcare management system designed to streamline patient registration, medical record keeping, appointment scheduling, and queue management.

## Tech Stack

- **Backend**: .NET 8 Web API
- **Frontend**: React + TypeScript + Vite
- **Database**: PostgreSQL
- **Security**: JWT-based Authentication

## Project Structure

- `backend/`: ASP.NET Core Web API layer.
- `frontend/`: React + TypeScript UI layer.
- `database/`: Database schema and migration scripts.
- `docs/`: System documentation (Architecture, Structure, etc.).

## Getting Started

Use the provided `Makefile` to quickly set up and run the project:

```bash
make help
```
