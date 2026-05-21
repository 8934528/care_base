namespace CareBase.Shared.DTOs;

public class ReportsDto
{
    public int TotalPatients { get; set; }
    public int TodayAppointments { get; set; }
    public int CurrentQueue { get; set; }
    public int CompletedToday { get; set; }
    public List<DiseaseTrendDto> DiseaseTrends { get; set; } = [];
    public List<GenderStatsDto> GenderStats { get; set; } = [];
    public List<AppointmentStatsDto> AppointmentStats { get; set; } = [];
    public List<MonthlyTrendDto> MonthlyVisits { get; set; } = [];
}
