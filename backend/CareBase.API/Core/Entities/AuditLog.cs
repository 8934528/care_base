namespace CareBase.Core.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Action { get; set; }
    public string Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public User User { get; set; }
}
