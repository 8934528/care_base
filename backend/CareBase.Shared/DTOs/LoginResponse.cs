namespace CareBase.Shared.DTOs;

public class LoginResponse
{
    public int UserId { get; set; }
    public required string Token { get; set; }
    public required string Role { get; set; }
    public required string FullName { get; set; }
    public string? PreferredName { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? EmployeeId { get; set; }
    public string? DepartmentName { get; set; }
    public List<string> Permissions { get; set; } = [];
    public bool MustChangePassword { get; set; }
}
