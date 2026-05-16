namespace CareBase.Shared.DTOs;

public class CreateMedicalRecordDto
{
    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public int? QueueId { get; set; }

    public required string Subjective { get; set; }

    public required string Objective { get; set; }

    public required string Assessment { get; set; }

    public required string Plan { get; set; }

    public required string DiagnosisCode { get; set; }

    public required string Prescription { get; set; }

    public required string BloodPressure { get; set; }

    public required string HeartRate { get; set; }

    public required string Temperature { get; set; }

    public required string OxygenLevel { get; set; }

    public required string Weight { get; set; }

    public required string Height { get; set; }

    public DateTime? FollowUpDate { get; set; }
}
