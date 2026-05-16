namespace CareBase.Shared.DTOs;

public class CreateAppointmentDto
{
    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public DateTime AppointmentDate { get; set; }

    public TimeSpan StartTime { get; set; }

    public TimeSpan EndTime { get; set; }

    public string AppointmentType { get; set; }

    public string Reason { get; set; }

    public string Priority { get; set; }

    public string Notes { get; set; }
}
