using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using Microsoft.Extensions.Configuration;

namespace CareBase.Core.Services;

public class NotificationService
{
    private readonly string? _sid;
    private readonly string? _token;
    private readonly string? _phone;
    private readonly string _whatsapp;

    public NotificationService()
    {
        _sid = Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID");
        _token = Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN");
        _phone = Environment.GetEnvironmentVariable("TWILIO_PHONE_NUMBER");
        _whatsapp = Environment.GetEnvironmentVariable("TWILIO_WHATSAPP_NUMBER") ?? "whatsapp:+14155238886";

        if (!string.IsNullOrEmpty(_sid) && !string.IsNullOrEmpty(_token))
        {
            TwilioClient.Init(_sid, _token);
        }
    }

    public async Task SendSms(string to, string message)
    {
        if (string.IsNullOrEmpty(_sid) || string.IsNullOrEmpty(_phone)) return;

        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_phone),
            to: new PhoneNumber(to)
        );
    }

    public async Task SendWhatsApp(string to, string message)
    {
        if (string.IsNullOrEmpty(_sid) || string.IsNullOrEmpty(_whatsapp)) return;
        
        await MessageResource.CreateAsync(
            body: message,
            from: new PhoneNumber(_whatsapp),
            to: new PhoneNumber($"whatsapp:{to}")
        );
    }
}
