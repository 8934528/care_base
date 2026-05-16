namespace CareBase.Core.Entities;

public class Role
{
    public int Id { get; set; }
    public string RoleName { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
