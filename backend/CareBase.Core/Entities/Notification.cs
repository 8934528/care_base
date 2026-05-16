using System.ComponentModel.DataAnnotations;

namespace CareBase.Core.Entities;

public class Notification
{
    public int Id { get; set; }
    public int? UserId { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Info"; // Info, Warning, Error
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public bool IsRead { get; set; } = false;
}
