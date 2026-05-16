using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CareBase.Core.Services;

public class ReminderBackgroundService(IServiceScopeFactory scopeFactory) : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var notificationService = scope.ServiceProvider.GetRequiredService<NotificationService>();

                var today = DateTime.UtcNow.Date;
                var tomorrowStart = today.AddDays(1);
                var tomorrowEnd = today.AddDays(2);

                // 1. Send Reminders for tomorrow
                var appointments = await context.Appointments
                    .Where(a => a.AppointmentDate >= tomorrowStart && a.AppointmentDate < tomorrowEnd && a.Status == "Scheduled")
                    .ToListAsync(stoppingToken);

                foreach (var appointment in appointments)
                {
                    var patient = await context.Patients.FindAsync([appointment.PatientId], stoppingToken);
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
                    .Where(a => a.AppointmentDate < today && a.Status == "Scheduled")
                    .ToListAsync(stoppingToken);

                foreach (var appointment in missed)
                {
                    appointment.Status = "Missed";
                    var patient = await context.Patients.FindAsync([appointment.PatientId], stoppingToken);
                    if (patient != null && !string.IsNullOrEmpty(patient.Phone))
                    {
                        string message = "You missed your CAREBASE appointment. Please contact the clinic to reschedule.";
                        try {
                            await notificationService.SendSms(patient.Phone, message);
                        } catch { /* Log failure */ }
                    }
                }

                await context.SaveChangesAsync(stoppingToken);
            }

            // Run every 24 hours
            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }
}
