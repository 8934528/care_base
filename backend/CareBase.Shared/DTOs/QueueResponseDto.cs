namespace CareBase.Shared.DTOs;

public class QueueResponseDto
{
    public required string QueueNumber { get; set; }
    public required string PatientRef { get; set; }
    public required string Priority { get; set; }
    public required string Status { get; set; }
}
