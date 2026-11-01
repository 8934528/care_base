namespace CareBase.Core.Entities;

public class StaffAvailability
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; } = new(8, 0, 0);
    public TimeSpan EndTime { get; set; } = new(17, 0, 0);
    public string ShiftName { get; set; } = "Standard";
    public bool IsAvailable { get; set; } = true;
    public string? ClinicLocation { get; set; }

    public User User { get; set; } = null!;
}
