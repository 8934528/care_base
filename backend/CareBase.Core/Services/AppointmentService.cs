using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class AppointmentService
{
    private readonly AppDbContext _context;
    private readonly NotificationService _notificationService;

    public AppointmentService(AppDbContext context, NotificationService notificationService)
    {
        _context = context;
        _notificationService = notificationService;
    }

    private string GenerateAppointmentRef()
    {
        return $"APT-{DateTime.Now.Year}-{Guid.NewGuid().ToString().Substring(0, 5).ToUpper()}";
    }

    public async Task<Appointment> CreateAppointment(CreateAppointmentDto dto)
    {
        // BOOKING CONFLICT CHECK
        var existing = await _context.Appointments
            .Where(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.Status != "Cancelled")
            .ToListAsync();

        bool hasConflict = existing.Any(a =>
            dto.StartTime < a.EndTime &&
            dto.EndTime > a.StartTime
        );

        if (hasConflict)
            throw new Exception("Doctor already booked for this time slot.");

        var appointment = new Appointment
        {
            AppointmentRef = GenerateAppointmentRef(),

            PatientId = dto.PatientId,
            DoctorId = dto.DoctorId,

            AppointmentDate = dto.AppointmentDate,

            StartTime = dto.StartTime,
            EndTime = dto.EndTime,

            AppointmentType = dto.AppointmentType,

            Reason = dto.Reason,

            Priority = dto.Priority ?? "Normal",

            Notes = dto.Notes
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        // Send SMS Confirmation
        var patient = await _context.Patients.FindAsync(appointment.PatientId);
        if (patient != null && !string.IsNullOrEmpty(patient.Phone))
        {
            try
            {
                string message = $"CAREBASE: Appointment Confirmed. Date: {appointment.AppointmentDate:yyyy-MM-dd} at {appointment.StartTime}. Ref: {appointment.AppointmentRef}";
                await _notificationService.SendSms(patient.Phone, message);
            }
            catch { /* Silent fail for demo purposes, should log in production */ }
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
