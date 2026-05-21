using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class NotificationService(AppDbContext context)
{
    private readonly AppDbContext _context = context;
    private readonly string? _sid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
    private readonly string? _token = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
    private readonly string? _phone = Environment.GetEnvironmentVariable("TWILIO_PHONE_NUMBER");
    private readonly string _whatsapp = Environment.GetEnvironmentVariable("TWILIO_WHATSAPP_NUMBER") ?? "whatsapp:+14155238886";

    static NotificationService()
    {
        var sid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        var token = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
        if (!string.IsNullOrEmpty(sid) && !string.IsNullOrEmpty(token))
        {
            TwilioClient.Init(sid, token);
        }
    }

    public async Task SendSms(
        string to,
        string message,
        int patientId,
        int? appointmentId = null,
        string notificationType = "Reminder")
    {
        await SendAndLogAsync(patientId, appointmentId, notificationType, "SMS", to, message,
            () => SendSmsMessage(to, message));
    }

    public async Task SendWhatsApp(
        string to,
        string message,
        int patientId,
        int? appointmentId = null,
        string notificationType = "Reminder")
    {
        await SendAndLogAsync(patientId, appointmentId, notificationType, "WhatsApp", to, message,
            () => SendWhatsAppMessage(to, message));
    }

    private async Task SendAndLogAsync(
        int patientId,
        int? appointmentId,
        string notificationType,
        string channel,
        string recipient,
        string message,
        Func<Task> sendAction)
    {
        var notification = new Notification
        {
            PatientId = patientId,
            AppointmentId = appointmentId,
            NotificationType = notificationType,
            Channel = channel,
            Recipient = recipient,
            Message = message,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        if (string.IsNullOrEmpty(_sid))
        {
            notification.Status = "Failed";
            await _context.SaveChangesAsync();
            return;
        }

        try
        {
            await sendAction();
            notification.Status = "Sent";
            notification.SentAt = DateTime.UtcNow;
        }
        catch
        {
            notification.Status = "Failed";
        }

        await _context.SaveChangesAsync();
    }

    private async Task SendSmsMessage(string to, string message)
    {
        if (string.IsNullOrEmpty(_phone)) return;

        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_phone),
            to: new PhoneNumber(to)
        );
    }

    private async Task SendWhatsAppMessage(string to, string message)
    {
        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_whatsapp),
            to: new PhoneNumber($"whatsapp:{to}")
        );
    }

    public async Task<List<Notification>> GetRecentAsync(int limit = 100)
    {
        return await _context.Notifications
            .Include(n => n.Patient)
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .ToListAsync();
    }
}
