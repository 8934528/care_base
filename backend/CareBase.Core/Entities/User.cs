namespace CareBase.Core.Entities;

public class User
{
    public int Id { get; set; }
    public string? EmployeeId { get; set; }
    public required string FullName { get; set; }
    public string? PreferredName { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? JobTitle { get; set; }
    public required string PasswordHash { get; set; }
    
    public int? DepartmentId { get; set; }
    public Department? Department { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;

    public string? ProfessionalRegistration { get; set; }
    public string AccountStatus { get; set; } = "Active";
    public bool IsActive { get; set; } = true;

    public DateTime? EmploymentStartDate { get; set; }
    public DateTime? EmploymentEndDate { get; set; }

    public int FailedLoginAttempts { get; set; } = 0;
    public DateTime? LockoutEnd { get; set; }
    public bool MustChangePassword { get; set; } = false;

    public DateTime? LastLogin { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
