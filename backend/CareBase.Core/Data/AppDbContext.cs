using Microsoft.EntityFrameworkCore;
using CareBase.Core.Entities;

namespace CareBase.Core.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Patient> Patients { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<MedicalRecord> MedicalRecords { get; set; } = null!;
    public DbSet<Note> Notes { get; set; } = null!;
    public DbSet<QueueItem> Queue { get; set; } = null!;
    public DbSet<AuditLog> AuditLogs { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<StaffAvailability> StaffAvailabilities { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StaffAvailability>()
            .HasIndex(sa => new { sa.UserId, sa.DayOfWeek })
            .IsUnique();

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Patient)
            .WithMany()
            .HasForeignKey(n => n.PatientId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.Appointment)
            .WithMany()
            .HasForeignKey(n => n.AppointmentId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.PatientId)
            .HasDatabaseName("idx_notifications_patient");

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.Status)
            .HasDatabaseName("idx_notifications_status");
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        NormalizeDateTimeProperties();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default)
    {
        NormalizeDateTimeProperties();
        return base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
    }

    private void NormalizeDateTimeProperties()
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.State is not (EntityState.Added or EntityState.Modified))
                continue;

            foreach (var property in entry.Properties)
            {
                if (property.Metadata.ClrType == typeof(DateTime) && property.CurrentValue is DateTime dt)
                    property.CurrentValue = ToUtc(dt);
                else if (property.Metadata.ClrType == typeof(DateTime?) && property.CurrentValue is DateTime nullableDt)
                    property.CurrentValue = ToUtc(nullableDt);
            }
        }
    }

    private static DateTime ToUtc(DateTime value) =>
        value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
}
