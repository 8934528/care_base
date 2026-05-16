namespace CareBase.Shared.DTOs;

public class AddToQueueDto
{
    public int PatientId { get; set; }
    public string PatientRef { get; set; }
    public string Priority { get; set; }
}
