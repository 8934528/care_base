using Microsoft.EntityFrameworkCore;
using CareBase.Core.Entities;

namespace CareBase.Core.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Patient> Patients { get; set; }
    public DbSet<MedicalRecord> MedicalRecords { get; set; }
    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<QueueEntry> Queue { get; set; }
    public DbSet<Note> Notes { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }
}
