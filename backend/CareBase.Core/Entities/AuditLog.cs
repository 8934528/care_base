namespace CareBase.Core.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
    public required string Action { get; set; }
    public required string Module { get; set; }
    public string? ResourceId { get; set; }
    public required string IpAddress { get; set; }
    public required string Details { get; set; }
    public string Result { get; set; } = "Success";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
}
