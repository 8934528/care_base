using Microsoft.EntityFrameworkCore;
using CareBase.Core.Entities;
using BCrypt.Net;

namespace CareBase.Core.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {

        if (!context.Roles.Any())
        {
            var roles = new Role[]
            {
                new() { RoleName = "Admin", Description = "Full System Access" },
                new() { RoleName = "Doctor", Description = "Clinical & Patient Management" },
                new() { RoleName = "Nurse", Description = "Patient Care & Vitals" },
                new() { RoleName = "Clerk", Description = "Registration & Scheduling" }
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
        }

        var doctorRole = context.Roles.FirstOrDefault(r => r.RoleName == "Doctor");
        if (doctorRole != null && !context.Users.Any(u => u.RoleId == doctorRole.Id))
        {
            context.Users.Add(new User
            {
                FullName = "Dr. Sarah Mokoena",
                Email = "doctor@carebase.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor@123"),
                RoleId = doctorRole.Id,
                IsActive = true
            });
            context.SaveChanges();
        }

        var nurseRole = context.Roles.FirstOrDefault(r => r.RoleName == "Nurse");
        if (nurseRole != null && !context.Users.Any(u => u.RoleId == nurseRole.Id))
        {
            context.Users.Add(new User
            {
                FullName = "Nurse Thandi Nkosi",
                Email = "nurse@carebase.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Nurse@123"),
                RoleId = nurseRole.Id,
                IsActive = true
            });
            context.SaveChanges();
        }

        var demoDoctor = context.Users
            .Include(u => u.Role)
            .FirstOrDefault(u => u.Role.RoleName == "Doctor");

        if (demoDoctor != null && !context.StaffAvailabilities.Any(a => a.UserId == demoDoctor.Id))
        {
            context.StaffAvailabilities.AddRange(
                new StaffAvailability { UserId = demoDoctor.Id, DayOfWeek = DayOfWeek.Monday },
                new StaffAvailability { UserId = demoDoctor.Id, DayOfWeek = DayOfWeek.Wednesday }
            );
            context.SaveChanges();
        }

        if (!context.Patients.Any())
        {
            try
            {
                var sqlFilePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "database", "seed", "seed_demo_patients.sql");
                if (File.Exists(sqlFilePath))
                {
                    var sql = File.ReadAllText(sqlFilePath);
                    context.Database.ExecuteSqlRaw(sql);
                }
                else
                {
                    // Fallback path if ran from project root instead of CareBase.API
                    var fallbackPath = Path.Combine(Directory.GetCurrentDirectory(), "database", "seed", "seed_demo_patients.sql");
                    if (File.Exists(fallbackPath))
                    {
                        var sql = File.ReadAllText(fallbackPath);
                        context.Database.ExecuteSqlRaw(sql);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error seeding patients from SQL: {ex.Message}");
            }
        }
    }
}
