using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CareBase.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<AppDbContext>();
        var logger = serviceProvider.GetRequiredService<ILogger<AppDbContext>>();

        try
        {
            // Ensure database is created
            bool created = await context.Database.EnsureCreatedAsync();
            
            if (created)
            {
                logger.LogInformation("Database created.");
            }

            // Check if tables are empty and seed if necessary
            if (!await context.Roles.AnyAsync())
            {
                logger.LogInformation("Seeding database...");
                
                var baseDir = AppContext.BaseDirectory;
                // Move up to the root project directory from bin/Debug/net8.0/
                var projectRootDir = Path.GetFullPath(Path.Combine(baseDir, "..", "..", "..", "..", "..", ".."));
                
                var schemaPath = Path.Combine(projectRootDir, "database", "schema");
                var seedPath = Path.Combine(projectRootDir, "database", "seed");

                if (Directory.Exists(schemaPath))
                {
                    // Order matters if scripts are not idempotent
                    // But EnsureCreated already created the tables from entities
                    // So we only need to seed data if EnsureCreated doesn't handle some constraints/triggers
                }

                if (Directory.Exists(seedPath))
                {
                    await ExecuteSqlFile(context, Path.Combine(seedPath, "seed_roles.sql"), logger);
                    await ExecuteSqlFile(context, Path.Combine(seedPath, "seed_users.sql"), logger);
                    await ExecuteSqlFile(context, Path.Combine(seedPath, "seed_demo_patients.sql"), logger);
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while initializing the database.");
        }
    }

    private static async Task ExecuteSqlFile(AppDbContext context, string filePath, ILogger logger)
    {
        if (File.Exists(filePath))
        {
            logger.LogInformation($"Executing SQL script: {filePath}");
            var sql = await File.ReadAllTextAsync(filePath);
            await context.Database.ExecuteSqlRawAsync(sql);
        }
        else
        {
            logger.LogWarning($"SQL script not found: {filePath}");
        }
    }
}
