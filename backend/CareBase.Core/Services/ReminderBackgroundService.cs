using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CareBase.Core.Services;

public class ReminderBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public ReminderBackgroundService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

                var tomorrow = DateTime.Today.AddDays(1);

                // 1. Send Reminders for tomorrow
                var appointments = await context.Appointments
                    .Where(a => a.AppointmentDate.Date == tomorrow && a.Status == "Scheduled")
                    .ToListAsync();

                foreach (var appointment in appointments)
                {
                    var patient = await context.Patients.FindAsync(appointment.PatientId);
                    if (patient != null && !string.IsNullOrEmpty(patient.Phone))
                    {
                        string message = $"Reminder: You have a CAREBASE appointment tomorrow at {appointment.StartTime}. Reference: {appointment.AppointmentRef}";
                        try {
                            await notificationService.SendSms(patient.Phone, message);
                        } catch { /* Log failure */ }
                    }
                }

                // 2. Detect Missed Appointments (Scheduled in the past)
                var missed = await context.Appointments
                    .Where(a => a.AppointmentDate.Date < DateTime.Today && a.Status == "Scheduled")
                    .ToListAsync();

                foreach (var appointment in missed)
                {
                    appointment.Status = "Missed";
                    var patient = await context.Patients.FindAsync(appointment.PatientId);
                    if (patient != null && !string.IsNullOrEmpty(patient.Phone))
                    {
                        string message = "You missed your CAREBASE appointment. Please contact the clinic to reschedule.";
                        try {
                            await notificationService.SendSms(patient.Phone, message);
                        } catch { /* Log failure */ }
                    }
                }

                await context.SaveChangesAsync();
            }

            // Run every 24 hours
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
