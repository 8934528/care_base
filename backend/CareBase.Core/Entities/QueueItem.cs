namespace CareBase.Core.Entities;

public class QueueItem
{
    public int Id { get; set; }
    public required string QueueNumber { get; set; }

    public int PatientId { get; set; }
    public required string PatientRef { get; set; }

    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Waiting";

    public required string AssignedTo { get; set; }

    public DateTime CheckInTime { get; set; } = DateTime.Now;
    public DateTime? CalledTime { get; set; }
    public DateTime? CompletedTime { get; set; }
}
