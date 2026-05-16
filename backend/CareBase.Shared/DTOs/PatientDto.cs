namespace CareBase.Shared.DTOs;

public class PatientDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string IdNumber { get; set; }
    public string PatientRef { get; set; }
}

public class AppointmentDto
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; }
}
