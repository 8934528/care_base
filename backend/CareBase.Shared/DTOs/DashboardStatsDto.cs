namespace CareBase.Shared.DTOs;

public class DashboardStatsDto
{
    public int DailyVisits { get; set; }
    public int QueueLoad { get; set; }
    public int ActiveDoctors { get; set; }
    public int CompletedConsultations { get; set; }
    public int TotalPatients { get; set; }
    public int TotalEmployees { get; set; }
    public int ActiveEmployees { get; set; }
    public int TodayAppointments { get; set; }
    public int PendingFollowUps { get; set; }
    
    // Role-specific lists
    public List<AppointmentSummaryDto> RoleAppointments { get; set; } = [];
    public List<QueueSummaryDto> RoleQueueItems { get; set; } = [];
    public List<AuditLogItemDto> RecentSecurityEvents { get; set; } = [];

    // Charts & Trends
    public List<DiseaseTrendDto> DiseaseTrends { get; set; } = [];
    public List<GenderStatsDto> GenderStats { get; set; } = [];
    public List<AppointmentStatsDto> AppointmentStats { get; set; } = [];
}

public class AppointmentSummaryDto
{
    public int Id { get; set; }
    public required string AppointmentRef { get; set; }
    public int PatientId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string? DoctorName { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public required string AppointmentType { get; set; }
    public required string Priority { get; set; }
    public required string Status { get; set; }
    public string? Reason { get; set; }
}

public class QueueSummaryDto
{
    public int Id { get; set; }
    public required string QueueNumber { get; set; }
    public int PatientId { get; set; }
    public required string PatientRef { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public string Priority { get; set; } = "Normal";
    public string Status { get; set; } = "Waiting";
    public string AssignedTo { get; set; } = string.Empty;
    public DateTime CheckInTime { get; set; }
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
