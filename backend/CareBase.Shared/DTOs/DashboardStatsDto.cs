namespace CareBase.Shared.DTOs;

public class DashboardStatsDto
{
    public int DailyVisits { get; set; }
    public int QueueLoad { get; set; }
    public int ActiveDoctors { get; set; }
    public int CompletedConsultations { get; set; }
    public List<DiseaseTrendDto> DiseaseTrends { get; set; } = [];
    public List<GenderStatsDto> GenderStats { get; set; } = [];
    public List<AppointmentStatsDto> AppointmentStats { get; set; } = [];
}

public class DiseaseTrendDto
{
    public required string Disease { get; set; }
    public int TotalCases { get; set; }
}

public class MonthlyTrendDto
{
    public required string Month { get; set; }
    public int TotalVisits { get; set; }
}

public class GenderStatsDto
{
    public required string Gender { get; set; }
    public int Total { get; set; }
}

public class AppointmentStatsDto
{
    public required string Status { get; set; }
    public int Total { get; set; }
}
