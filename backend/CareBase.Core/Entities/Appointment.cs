namespace CareBase.Core.Entities;

public class Appointment
{
    public int Id { get; set; }

    public required string AppointmentRef { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public required string AppointmentType { get; set; }

    public required string Reason { get; set; }

    public string Status { get; set; } = "Scheduled";

    public string Priority { get; set; } = "Normal";

    public string? Notes { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
