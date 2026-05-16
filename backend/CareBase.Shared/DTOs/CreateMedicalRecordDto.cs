namespace CareBase.Shared.DTOs;

public class CreateMedicalRecordDto
{
    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public int? QueueId { get; set; }

    public string Subjective { get; set; }

    public string Objective { get; set; }

    public string Assessment { get; set; }

    public string Plan { get; set; }

    public string DiagnosisCode { get; set; }

    public string Prescription { get; set; }

    public string BloodPressure { get; set; }

    public string HeartRate { get; set; }

    public string Temperature { get; set; }

    public string OxygenLevel { get; set; }

    public string Weight { get; set; }

    public string Height { get; set; }

    public DateTime? FollowUpDate { get; set; }
}
