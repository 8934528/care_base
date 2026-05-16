namespace CareBase.Shared.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string IdNumber { get; set; }
    public required string PatientRef { get; set; }
}

public class AppointmentDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public required string Status { get; set; }
}
