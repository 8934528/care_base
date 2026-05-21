using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class AppointmentService(AppDbContext context, NotificationService notificationService)
{
    private readonly AppDbContext _context = context;
    private readonly NotificationService _notificationService = notificationService;

    private static string GenerateAppointmentRef()
    {
        return $"APT-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..5].ToUpper()}";
    }

    public async Task<Appointment> CreateAppointment(CreateAppointmentDto dto)
    {
        if (dto.DoctorId.HasValue)
        {
            var doctorExists = await _context.Users
                .Include(u => u.Role)
                .AnyAsync(u => u.Id == dto.DoctorId && u.Role.RoleName == "Doctor" && u.IsActive);

            if (!doctorExists)
                throw new Exception("Selected doctor is not valid or not active.");

            var appointmentDay = dto.AppointmentDate.Date.DayOfWeek;
            var doctorAvailable = await _context.StaffAvailabilities
                .AnyAsync(a => a.UserId == dto.DoctorId && a.DayOfWeek == appointmentDay);

            if (!doctorAvailable)
                throw new Exception("Selected doctor is not available on the chosen date.");

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
                throw new Exception("Doctor already booked for this time slot.");
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
            Reason = dto.Reason ?? "",
            Priority = dto.Priority ?? "Normal",
            Notes = dto.Notes
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

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
            catch { /* Silent fail for demo */ }
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
            .ToListAsync();
    }

    public async Task UpdateStatus(int id, string status)
    {
        var appointment = await _context.Appointments.FindAsync(id);

        if (appointment == null)
            return;

        appointment.Status = status;
        await _context.SaveChangesAsync();
    }
}
