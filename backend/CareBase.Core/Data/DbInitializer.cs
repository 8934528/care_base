using Microsoft.EntityFrameworkCore;
using CareBase.Core.Entities;
using BCrypt.Net;

namespace CareBase.Core.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {

        if (context.Roles.Any()) return;

        var roles = new Role[]
        {
            new Role { RoleName = "Admin", Description = "Full System Access" },
            new Role { RoleName = "Doctor", Description = "Clinical & Patient Management" },
            new Role { RoleName = "Nurse", Description = "Patient Care & Vitals" },
            new Role { RoleName = "Clerk", Description = "Registration & Scheduling" }
        };

        context.Roles.AddRange(roles);
        context.SaveChanges();

        var adminRole = context.Roles.First(r => r.RoleName == "Admin");
        var adminUser = new User
        {
            FullName = "System Administrator",
            Email = "admin@carebase.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            RoleId = adminRole.Id,
            IsActive = true
        };

        context.Users.Add(adminUser);
        context.SaveChanges();

        // Seed some sample patients
        var patients = new Patient[]
        {
            new Patient { 
                FirstName = "John", 
                LastName = "Doe", 
                IdNumber = "8501015001081", 
                Gender = "Male", 
                DateOfBirth = new DateTime(1985, 1, 1).ToUniversalTime(),
                PatientRef = "PAT-0001",
                Phone = "+27712345678",
                Email = "john.doe@example.com",
                Address = "123 Main St, Cape Town",
                EmergencyContactName = "Jane Doe",
                EmergencyContactPhone = "+27712345679",
                MedicalHistory = "None"
            },
            new Patient { 
                FirstName = "Jane", 
                LastName = "Smith", 
                IdNumber = "9205055001082", 
                Gender = "Female", 
                DateOfBirth = new DateTime(1992, 5, 5).ToUniversalTime(),
                PatientRef = "PAT-0002",
                Phone = "+27723456789",
                Email = "jane.smith@example.com",
                Address = "456 Oak Ave, Johannesburg",
                EmergencyContactName = "John Smith",
                EmergencyContactPhone = "+27723456780",
                MedicalHistory = "Allergic to Penicillin"
            }
        };

        context.Patients.AddRange(patients);
        context.SaveChanges();
    }
}
