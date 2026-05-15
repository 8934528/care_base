namespace CareBase.Core.Entities;

public class MedicalRecord
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string Diagnosis { get; set; }
    public string Treatment { get; set; }
    public string Prescription { get; set; }
    public int CreatedById { get; set; } // Doctor ID
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; }
    public User CreatedBy { get; set; }
}
