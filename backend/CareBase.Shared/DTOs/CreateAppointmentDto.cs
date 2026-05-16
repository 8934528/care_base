namespace CareBase.Shared.DTOs;

public class CreateAppointmentDto
{
    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public required string AppointmentType { get; set; }

    public required string Reason { get; set; }

    public required string Priority { get; set; }

    public string? Notes { get; set; }
}
