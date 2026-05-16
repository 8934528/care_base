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
    public required string Email { get; set; }
    public required string Address { get; set; }

    public required string EmergencyContactName { get; set; }
    public required string EmergencyContactPhone { get; set; }

    public required string MedicalHistory { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
}
