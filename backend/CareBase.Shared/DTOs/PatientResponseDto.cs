namespace CareBase.Shared.DTOs;

public class PatientResponseDto
{
    public required string PatientRef { get; set; }
    public required string FullName { get; set; }
    public required string IdNumber { get; set; }
    public required string Gender { get; set; }
    public required string Phone { get; set; }
}
