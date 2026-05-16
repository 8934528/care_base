namespace CareBase.Shared.DTOs;

public class AddToQueueDto
{
    public int PatientId { get; set; }
    public required string PatientRef { get; set; }
    public required string Priority { get; set; }
}
