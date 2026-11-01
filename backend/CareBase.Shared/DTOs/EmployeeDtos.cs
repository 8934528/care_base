namespace CareBase.Shared.DTOs;

public class EmployeeDto
{
    public int Id { get; set; }
    public string? EmployeeId { get; set; }
    public required string FullName { get; set; }
    public string? PreferredName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? JobTitle { get; set; }
    public int? DepartmentId { get; set; }
    public string? DepartmentName { get; set; }
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? ProfessionalRegistration { get; set; }
    public string AccountStatus { get; set; } = "Active";
    public bool IsActive { get; set; } = true;
    public DateTime? EmploymentStartDate { get; set; }
    public DateTime? EmploymentEndDate { get; set; }
    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<string> Permissions { get; set; } = [];
}

public class EmployeeDetailDto : EmployeeDto
{
    public List<StaffAvailabilityDto> Availability { get; set; } = [];
    public List<AuditLogItemDto> RecentActivity { get; set; } = [];
}

public class CreateEmployeeDto
{
    public required string FullName { get; set; }
    public string? PreferredName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? JobTitle { get; set; }
    public int? DepartmentId { get; set; }
    public int RoleId { get; set; }
    public string? ProfessionalRegistration { get; set; }
    public DateTime? EmploymentStartDate { get; set; }
    public required string TemporaryPassword { get; set; }
    public List<DayOfWeek>? WorkingDays { get; set; }
    public string? ShiftName { get; set; }
}

public class UpdateEmployeeDto
{
    public required string FullName { get; set; }
    public string? PreferredName { get; set; }
    public string? Phone { get; set; }
    public string? JobTitle { get; set; }
    public int? DepartmentId { get; set; }
    public int RoleId { get; set; }
    public string? ProfessionalRegistration { get; set; }
    public DateTime? EmploymentStartDate { get; set; }
    public DateTime? EmploymentEndDate { get; set; }
}

public class UpdateAccountStatusDto
{
    public required string Status { get; set; }
    public string? Reason { get; set; }
}

public class ResetPasswordDto
{
    public required string NewPassword { get; set; }
}

public class StaffAvailabilityDto
{
    public int? Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string ShiftName { get; set; } = "Standard";
    public bool IsAvailable { get; set; } = true;
    public string? ClinicLocation { get; set; }
}

public class DepartmentDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public int EmployeeCount { get; set; }
}

public class CreateDepartmentDto
{
    public required string Name { get; set; }
    public required string Code { get; set; }
    public string? Description { get; set; }
}

public class AuditLogItemDto
{
    public int Id { get; set; }
    public string? UserName { get; set; }
    public string? UserRole { get; set; }
    public required string Action { get; set; }
    public required string Module { get; set; }
    public string? ResourceId { get; set; }
    public required string Details { get; set; }
    public string Result { get; set; } = "Success";
    public DateTime Timestamp { get; set; }
}

