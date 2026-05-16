namespace CareBase.Core.Entities;

public class MedicalRecord
{
    public int Id { get; set; }

    public int PatientId { get; set; }

    public int DoctorId { get; set; }

    public int? QueueId { get; set; }

    public string VisitReference { get; set; }

    public DateTime VisitDate { get; set; } = DateTime.Now;

    // SOAP
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

    public string Status { get; set; } = "Open";

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
