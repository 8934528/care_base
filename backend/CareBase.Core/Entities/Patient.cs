namespace CareBase.Core.Entities;

public class Patient
{
    public int Id { get; set; }
    public required string PatientRef { get; set; }

    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public required string IdNumber { get; set; }
    public required string Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }

    public required string Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }

    public string? EmergencyContactName { get; set; }
    public string? EmergencyContactPhone { get; set; }

    public string? MedicalHistory { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
