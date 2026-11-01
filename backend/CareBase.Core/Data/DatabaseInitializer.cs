using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Npgsql;

namespace CareBase.Core.Data;

public static class DatabaseInitializer
{
    private const string TargetDatabaseName = "carebase";

    public static string NormalizeConnectionString(string rawConnectionString)
    {
        var builder = new NpgsqlConnectionStringBuilder(rawConnectionString)
        {
            Database = TargetDatabaseName
        };
        return builder.ConnectionString;
    }

    public static string SanitizeConnectionString(string connectionString)
    {
        try
        {
            var builder = new NpgsqlConnectionStringBuilder(connectionString);
            if (!string.IsNullOrEmpty(builder.Password))
            {
                builder.Password = "******";
            }
            return builder.ConnectionString;
        }
        catch
        {
            return "Host=***;Database=carebase;Username=***";
        }
    }

    public static void Initialize(string rawConnectionString, AppDbContext context, ILogger logger)
    {
        var connectionString = NormalizeConnectionString(rawConnectionString);
        var sanitized = SanitizeConnectionString(connectionString);

        logger.LogInformation("Starting database initialization for {Target}...", sanitized);

        var builder = new NpgsqlConnectionStringBuilder(connectionString);

        // Check connection and verify whether database exists
        EnsureDatabaseExists(builder, logger);

        // Check tables, apply pending migrations safely, and seed required config
        EnsureSchemaAndSeed(connectionString, context, logger);

        logger.LogInformation("Database initialization completed successfully.");
    }

    private static void EnsureDatabaseExists(NpgsqlConnectionStringBuilder builder, ILogger logger)
    {
        try
        {
            using var testConn = new NpgsqlConnection(builder.ConnectionString);
            testConn.Open();
            logger.LogInformation("Connected successfully to PostgreSQL database '{Database}'.", TargetDatabaseName);
            return;
        }
        catch (PostgresException ex) when (ex.SqlState == "3D000")
        {
            logger.LogWarning("Database '{Database}' does not exist. Attempting creation...", TargetDatabaseName);
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to connect to PostgreSQL server at {Host}:{Port}: {Error}",
                builder.Host, builder.Port, ex.Message);
            throw new InvalidOperationException(
                $"Could not connect to PostgreSQL server at {builder.Host}:{builder.Port}. Verify server is running and credentials are valid.", ex);
        }

        // Connect to maintenance database to create carebase
        var adminBuilder = new NpgsqlConnectionStringBuilder(builder.ConnectionString)
        {
            Database = "postgres"
        };

        try
        {
            using var adminConn = new NpgsqlConnection(adminBuilder.ConnectionString);
            adminConn.Open();

            using var checkCmd = new NpgsqlCommand(
                "SELECT 1 FROM pg_database WHERE datname = @name", adminConn);
            checkCmd.Parameters.AddWithValue("name", TargetDatabaseName);
            var exists = checkCmd.ExecuteScalar() != null;

            if (!exists)
            {
                using var createCmd = new NpgsqlCommand($"CREATE DATABASE \"{TargetDatabaseName}\"", adminConn);
                createCmd.ExecuteNonQuery();
                logger.LogInformation("Database '{Database}' was created successfully.", TargetDatabaseName);
            }
        }
        catch (Exception ex)
        {
            logger.LogError("Failed to automatically create database '{Database}': {Error}", TargetDatabaseName, ex.Message);
            throw new InvalidOperationException(
                $"The '{TargetDatabaseName}' database does not exist and could not be created automatically. " +
                $"Please create the '{TargetDatabaseName}' database manually in PostgreSQL.", ex);
        }
    }

    private static void EnsureSchemaAndSeed(string connectionString, AppDbContext context, ILogger logger)
    {
        try
        {
            // Check if tables already exist without migration history
            bool usersTableExists = false;
            using (var conn = new NpgsqlConnection(connectionString))
            {
                conn.Open();
                using var cmd = new NpgsqlCommand(
                    "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users')", conn);
                usersTableExists = (bool)(cmd.ExecuteScalar() ?? false);
            }

            if (usersTableExists)
            {
                // Ensure migration history records InitialCreate if missing to prevent duplicate table errors
                context.Database.ExecuteSqlRaw(
                    """
                    CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
                        "MigrationId" character varying(150) NOT NULL,
                        "ProductVersion" character varying(32) NOT NULL,
                        CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
                    );
                    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
                    VALUES ('20261101141005_InitialCreate', '8.0.0')
                    ON CONFLICT DO NOTHING;
                    """);
            }

            var pendingMigrations = context.Database.GetPendingMigrations().ToList();
            if (pendingMigrations.Count > 0)
            {
                logger.LogInformation("Applying {Count} pending database migration(s)...", pendingMigrations.Count);
                context.Database.Migrate();
                logger.LogInformation("Database migrations applied successfully.");
            }
            else
            {
                // If brand new database with no tables, migrate creates all tables
                if (!usersTableExists)
                {
                    logger.LogInformation("Initializing database tables via EF Core migrations...");
                    context.Database.Migrate();
                }
                else
                {
                    logger.LogInformation("Database schema is up to date.");
                }
            }

            // Seed required baseline data (Roles, Departments, Admin)
            DbInitializer.Initialize(context);
        }
        catch (Exception ex)
        {
            logger.LogError("Failed during database schema update or seeding: {Error}", ex.Message);
            throw new InvalidOperationException(
                "Database schema initialization failed. Application startup cannot continue with an unusable database.", ex);
        }
    }
}
