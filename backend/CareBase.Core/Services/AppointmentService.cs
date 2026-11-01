using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class AppointmentService(AppDbContext context, NotificationService notificationService, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly NotificationService _notificationService = notificationService;
    private readonly AuditService _audit = audit;

    private static string GenerateAppointmentRef()
    {
        return $"APT-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<Appointment> CreateAppointment(CreateAppointmentDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        if (dto.DoctorId.HasValue)
        {
            var doctor = await _context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == dto.DoctorId && u.Role.RoleName == "Doctor" && u.IsActive);

            if (doctor == null)
                throw new InvalidOperationException("Selected doctor is not valid or not active.");

            var appointmentDay = dto.AppointmentDate.Date.DayOfWeek;
            var doctorAvailable = await _context.StaffAvailabilities
                .AnyAsync(a => a.UserId == dto.DoctorId && a.DayOfWeek == appointmentDay && a.IsAvailable);

            if (!doctorAvailable)
                throw new InvalidOperationException($"Dr. {doctor.FullName} is not scheduled to work on {appointmentDay}s.");

            var existing = await _context.Appointments
                .Where(a =>
                    a.DoctorId == dto.DoctorId &&
                    a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                    a.Status != "Cancelled")
                .ToListAsync();

            var hasConflict = existing.Any(a =>
                dto.StartTime < a.EndTime &&
                dto.EndTime > a.StartTime);

            if (hasConflict)
                throw new InvalidOperationException("Doctor already has a booked appointment during this time slot.");
        }

        var appointment = new Appointment
        {
            AppointmentRef = GenerateAppointmentRef(),
            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,
            AppointmentDate = DateTime.SpecifyKind(dto.AppointmentDate.Date, DateTimeKind.Utc),
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            AppointmentType = dto.AppointmentType,
            Reason = dto.Reason ?? "General Consultation",
            Priority = dto.Priority ?? "Normal",
            Notes = dto.Notes,
            CreatedBy = currentUserId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "AppointmentCreated",
            "Appointments",
            $"Created appointment {appointment.AppointmentRef} for patient ID {appointment.PatientId} on {appointment.AppointmentDate:yyyy-MM-dd}",
            resourceId: appointment.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        var patient = await _context.Patients.FindAsync(appointment.PatientId);
        if (patient != null && !string.IsNullOrEmpty(patient.Phone))
        {
            try
            {
                var message = $"CAREBASE: Appointment Confirmed. Date: {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.StartTime}. Ref: {appointment.AppointmentRef}";
                await _notificationService.SendSms(
                    patient.Phone,
                    message,
                    patient.Id,
                    appointment.Id,
                    "Confirmation");
            }
            catch { /* SMS service fallback */ }
        }

        return appointment;
    }

    public async Task<List<Appointment>> GetAppointmentsByDate(DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.AppointmentDate.Date == date.Date)
            .OrderBy(a => a.StartTime)
            .ToListAsync();
    }

    public async Task<List<Appointment>> GetDoctorAppointments(int doctorId)
    {
        return await _context.Appointments
            .Where(a => a.DoctorId == doctorId)
            .OrderByDescending(a => a.AppointmentDate)
            .ThenBy(a => a.StartTime)
            .ToListAsync();
    }

    public async Task UpdateStatus(int id, string status, int currentUserId, string currentUserName, string currentUserRole)
    {
        var appointment = await _context.Appointments.FindAsync(id)
            ?? throw new KeyNotFoundException("Appointment not found.");

        var oldStatus = appointment.Status;
        appointment.Status = status;
        appointment.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "AppointmentStatusChanged",
            "Appointments",
            $"Updated appointment {appointment.AppointmentRef} status from {oldStatus} to {status}",
            resourceId: appointment.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );
    }
}
