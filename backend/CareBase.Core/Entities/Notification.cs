namespace CareBase.Core.Entities;

public class Notification
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public int? AppointmentId { get; set; }

    /// <summary>Reminder | Confirmation | MissedAppointment</summary>
    public string? NotificationType { get; set; }

    /// <summary>SMS | WhatsApp</summary>
    public string? Channel { get; set; }

    public string? Recipient { get; set; }
    public string? Message { get; set; }

    /// <summary>Pending | Sent | Failed</summary>
    public string Status { get; set; } = "Pending";

    public DateTime? SentAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; } = null!;
    public Appointment? Appointment { get; set; }
}
