namespace CareBase.Core.Entities;

public class QueueEntry
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string Priority { get; set; } = "Normal"; // Normal, Urgent
    public string Status { get; set; } = "Waiting"; // Waiting, InProgress, Completed
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public Patient Patient { get; set; }
}
