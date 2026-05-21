namespace CareBase.Core.Entities;

public class StaffAvailability
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }

    public User User { get; set; } = null!;
}
