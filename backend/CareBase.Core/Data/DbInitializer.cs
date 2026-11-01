using Microsoft.EntityFrameworkCore;
using CareBase.Core.Entities;
using BCrypt.Net;

namespace CareBase.Core.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Seed default roles if missing
        if (!context.Roles.Any())
        {
            var roles = new Role[]
            {
                new() { RoleName = "Admin", Description = "System Administration, Security & Employee Management" },
                new() { RoleName = "Manager", Description = "Healthcare Operations & Workforce Management" },
                new() { RoleName = "Doctor", Description = "Clinical Consultations, Diagnoses & Records" },
                new() { RoleName = "Nurse", Description = "Triage, Vitals, Queue & Patient Care" },
                new() { RoleName = "Clerk", Description = "Patient Registration, Scheduling & Reception" }
            };

            context.Roles.AddRange(roles);
            context.SaveChanges();
        }

        // Seed clinical and administrative departments if missing
        if (!context.Departments.Any())
        {
            var departments = new Department[]
            {
                new() { Name = "General Practice", Code = "GP", Description = "Outpatient consultations and general medical care" },
                new() { Name = "Nursing", Code = "NUR", Description = "Triage, patient monitoring, and vital sign assessment" },
                new() { Name = "Reception & Administration", Code = "ADMIN", Description = "Front desk, patient intake, and facility management" },
                new() { Name = "Pharmacy", Code = "PHARM", Description = "Medication dispensing and pharmaceutical care" },
                new() { Name = "Laboratory", Code = "LAB", Description = "Diagnostic pathology and test analysis" },
                new() { Name = "Radiology", Code = "RAD", Description = "Medical imaging and X-ray services" },
                new() { Name = "Emergency", Code = "EMERG", Description = "Acute urgent and emergency medical triage" }
            };

            context.Departments.AddRange(departments);
            context.SaveChanges();
        }

        // Seed initial system administrator account if missing
        var adminRole = context.Roles.FirstOrDefault(r => r.RoleName == "Admin");
        var adminDept = context.Departments.FirstOrDefault(d => d.Code == "ADMIN");

        if (adminRole != null && !context.Users.Any(u => u.RoleId == adminRole.Id))
        {
            var adminUser = new User
            {
                EmployeeId = "EMP-0001",
                FullName = "System Administrator",
                PreferredName = "Administrator",
                Email = "admin@carebase.com",
                Phone = "+27 11 000 0001",
                JobTitle = "System Administrator",
                DepartmentId = adminDept?.Id,
                RoleId = adminRole.Id,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                AccountStatus = "Active",
                IsActive = true,
                EmploymentStartDate = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            context.SaveChanges();
        }

        // Patient database is intentionally left empty.
        // Patients are only registered by authorised employees.
    }
}
