namespace CareBase.Core.Entities;

public class Patient
{
    public int Id { get; set; }
    public string PatientRef { get; set; }

    public string FirstName { get; set; }
    public string LastName { get; set; }

    public string IdNumber { get; set; }
    public string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public string Phone { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }

    public string EmergencyContactName { get; set; }
    public string EmergencyContactPhone { get; set; }

    public string MedicalHistory { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
