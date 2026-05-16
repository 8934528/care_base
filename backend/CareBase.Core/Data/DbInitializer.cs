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
