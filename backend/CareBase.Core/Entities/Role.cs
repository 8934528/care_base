namespace CareBase.Core.Entities;

public class Role
{
    public int Id { get; set; }
    public required string RoleName { get; set; }
    public required string Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
