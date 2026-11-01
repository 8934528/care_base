using CareBase.Core.Data;
using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Shared.Permissions;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;

namespace CareBase.Core.Services;

public class EmployeeService(AppDbContext context, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly AuditService _audit = audit;

    private async Task<string> GenerateEmployeeIdAsync()
    {
        var count = await _context.Users.CountAsync();
        return $"EMP-{(count + 1):D4}";
    }

    public async Task<(List<EmployeeDto> Employees, int TotalCount, int ActiveCount, int InactiveCount, int PendingCount)> GetEmployeesAsync(
        string? search = null,
        int? departmentId = null,
        string? role = null,
        string? status = null,
        int page = 1,
        int pageSize = 15)
    {
        var query = _context.Users
            .Include(u => u.Role)
            .Include(u => u.Department)
            .AsNoTracking()
            .AsQueryable();

        if (departmentId.HasValue && departmentId > 0)
            query = query.Where(u => u.DepartmentId == departmentId.Value);

        if (!string.IsNullOrWhiteSpace(role) && role != "All")
            query = query.Where(u => u.Role.RoleName == role);

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
            query = query.Where(u => u.AccountStatus == status);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(u =>
                u.FullName.ToLower().Contains(term) ||
                u.Email.ToLower().Contains(term) ||
                (u.EmployeeId != null && u.EmployeeId.ToLower().Contains(term)) ||
                (u.JobTitle != null && u.JobTitle.ToLower().Contains(term)));
        }

        var total = await query.CountAsync();

        var activeCount = await _context.Users.CountAsync(u => u.AccountStatus == "Active");
        var inactiveCount = await _context.Users.CountAsync(u => u.AccountStatus == "Inactive" || u.AccountStatus == "Deactivated" || u.AccountStatus == "Suspended");
        var pendingCount = await _context.Users.CountAsync(u => u.AccountStatus == "Pending");

        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new EmployeeDto
            {
                Id = u.Id,
                EmployeeId = u.EmployeeId,
                FullName = u.FullName,
                PreferredName = u.PreferredName,
                Email = u.Email,
                Phone = u.Phone,
                JobTitle = u.JobTitle,
                DepartmentId = u.DepartmentId,
                DepartmentName = u.Department != null ? u.Department.Name : null,
                RoleId = u.RoleId,
                RoleName = u.Role != null ? u.Role.RoleName : string.Empty,
                ProfessionalRegistration = u.ProfessionalRegistration,
                AccountStatus = u.AccountStatus,
                IsActive = u.IsActive,
                EmploymentStartDate = u.EmploymentStartDate,
                EmploymentEndDate = u.EmploymentEndDate,
                LastLogin = u.LastLogin,
                CreatedAt = u.CreatedAt,
                Permissions = AppPermissions.GetRolePermissions(u.Role != null ? u.Role.RoleName : "Clerk").ToList()
            })
            .ToListAsync();

        return (users, total, activeCount, inactiveCount, pendingCount);
    }

    public async Task<EmployeeDetailDto?> GetEmployeeByIdAsync(int id)
    {
        var u = await _context.Users
            .Include(x => x.Role)
            .Include(x => x.Department)
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == id);

        if (u == null) return null;

        var availability = await _context.StaffAvailabilities
            .Where(a => a.UserId == id)
            .OrderBy(a => a.DayOfWeek)
            .Select(a => new StaffAvailabilityDto
            {
                Id = a.Id,
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                ShiftName = a.ShiftName,
                IsAvailable = a.IsAvailable,
                ClinicLocation = a.ClinicLocation
            })
            .ToListAsync();

        var recentLogs = await _context.AuditLogs
            .Where(l => l.UserId == id || (l.ResourceId == id.ToString() && l.Module == "Employees"))
            .OrderByDescending(l => l.Timestamp)
            .Take(10)
            .Select(l => new AuditLogItemDto
            {
                Id = l.Id,
                UserName = l.UserName,
                UserRole = l.UserRole,
                Action = l.Action,
                Module = l.Module,
                ResourceId = l.ResourceId,
                Details = l.Details,
                Result = l.Result,
                Timestamp = l.Timestamp
            })
            .ToListAsync();

        var roleName = u.Role?.RoleName ?? "Clerk";

        return new EmployeeDetailDto
        {
            Id = u.Id,
            EmployeeId = u.EmployeeId,
            FullName = u.FullName,
            PreferredName = u.PreferredName,
            Email = u.Email,
            Phone = u.Phone,
            JobTitle = u.JobTitle,
            DepartmentId = u.DepartmentId,
            DepartmentName = u.Department?.Name,
            RoleId = u.RoleId,
            RoleName = roleName,
            ProfessionalRegistration = u.ProfessionalRegistration,
            AccountStatus = u.AccountStatus,
            IsActive = u.IsActive,
            EmploymentStartDate = u.EmploymentStartDate,
            EmploymentEndDate = u.EmploymentEndDate,
            LastLogin = u.LastLogin,
            CreatedAt = u.CreatedAt,
            Permissions = AppPermissions.GetRolePermissions(roleName).ToList(),
            Availability = availability,
            RecentActivity = recentLogs
        };
    }

    public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var email = dto.Email.Trim().ToLower();
        if (await _context.Users.AnyAsync(u => u.Email.ToLower() == email))
            throw new InvalidOperationException("An employee account with this email address already exists.");

        var role = await _context.Roles.FindAsync(dto.RoleId)
            ?? throw new InvalidOperationException("Selected role is invalid.");

        if (dto.DepartmentId.HasValue)
        {
            var deptExists = await _context.Departments.AnyAsync(d => d.Id == dto.DepartmentId.Value);
            if (!deptExists) throw new InvalidOperationException("Selected department is invalid.");
        }

        var employeeId = await GenerateEmployeeIdAsync();

        var user = new User
        {
            EmployeeId = employeeId,
            FullName = dto.FullName.Trim(),
            PreferredName = string.IsNullOrWhiteSpace(dto.PreferredName) ? null : dto.PreferredName.Trim(),
            Email = email,
            Phone = dto.Phone?.Trim(),
            JobTitle = dto.JobTitle?.Trim(),
            DepartmentId = dto.DepartmentId,
            RoleId = dto.RoleId,
            ProfessionalRegistration = dto.ProfessionalRegistration?.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.TemporaryPassword),
            AccountStatus = "Active",
            IsActive = true,
            MustChangePassword = true,
            EmploymentStartDate = dto.EmploymentStartDate ?? DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Configure initial availability if days provided
        if (dto.WorkingDays != null && dto.WorkingDays.Count > 0)
        {
            foreach (var day in dto.WorkingDays)
            {
                _context.StaffAvailabilities.Add(new StaffAvailability
                {
                    UserId = user.Id,
                    DayOfWeek = day,
                    StartTime = new TimeSpan(8, 0, 0),
                    EndTime = new TimeSpan(17, 0, 0),
                    ShiftName = dto.ShiftName ?? "Standard",
                    IsAvailable = true
                });
            }
            await _context.SaveChangesAsync();
        }

        await _audit.LogAsync(
            "EmployeeCreated",
            "Employees",
            $"Created employee {user.FullName} ({user.EmployeeId}, Role: {role.RoleName})",
            resourceId: user.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return new EmployeeDto
        {
            Id = user.Id,
            EmployeeId = user.EmployeeId,
            FullName = user.FullName,
            PreferredName = user.PreferredName,
            Email = user.Email,
            Phone = user.Phone,
            JobTitle = user.JobTitle,
            DepartmentId = user.DepartmentId,
            DepartmentName = (await _context.Departments.FindAsync(user.DepartmentId))?.Name,
            RoleId = user.RoleId,
            RoleName = role.RoleName,
            ProfessionalRegistration = user.ProfessionalRegistration,
            AccountStatus = user.AccountStatus,
            IsActive = user.IsActive,
            EmploymentStartDate = user.EmploymentStartDate,
            EmploymentEndDate = user.EmploymentEndDate,
            CreatedAt = user.CreatedAt,
            Permissions = AppPermissions.GetRolePermissions(role.RoleName).ToList()
        };
    }

    public async Task<EmployeeDto> UpdateEmployeeAsync(int id, UpdateEmployeeDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Department)
            .FirstOrDefaultAsync(u => u.Id == id)
            ?? throw new KeyNotFoundException("Employee not found.");

        var role = await _context.Roles.FindAsync(dto.RoleId)
            ?? throw new InvalidOperationException("Selected role is invalid.");

        user.FullName = dto.FullName.Trim();
        user.PreferredName = string.IsNullOrWhiteSpace(dto.PreferredName) ? null : dto.PreferredName.Trim();
        user.Phone = dto.Phone?.Trim();
        user.JobTitle = dto.JobTitle?.Trim();
        user.DepartmentId = dto.DepartmentId;
        user.RoleId = dto.RoleId;
        user.ProfessionalRegistration = dto.ProfessionalRegistration?.Trim();
        user.EmploymentStartDate = dto.EmploymentStartDate;
        user.EmploymentEndDate = dto.EmploymentEndDate;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "EmployeeUpdated",
            "Employees",
            $"Updated details for employee {user.FullName} ({user.EmployeeId})",
            resourceId: user.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return new EmployeeDto
        {
            Id = user.Id,
            EmployeeId = user.EmployeeId,
            FullName = user.FullName,
            PreferredName = user.PreferredName,
            Email = user.Email,
            Phone = user.Phone,
            JobTitle = user.JobTitle,
            DepartmentId = user.DepartmentId,
            DepartmentName = user.Department?.Name,
            RoleId = user.RoleId,
            RoleName = role.RoleName,
            ProfessionalRegistration = user.ProfessionalRegistration,
            AccountStatus = user.AccountStatus,
            IsActive = user.IsActive,
            EmploymentStartDate = user.EmploymentStartDate,
            EmploymentEndDate = user.EmploymentEndDate,
            LastLogin = user.LastLogin,
            CreatedAt = user.CreatedAt,
            Permissions = AppPermissions.GetRolePermissions(role.RoleName).ToList()
        };
    }

    public async Task UpdateAccountStatusAsync(int id, UpdateAccountStatusDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var user = await _context.Users.FindAsync(id)
            ?? throw new KeyNotFoundException("Employee not found.");

        // Prevent self-deactivation of system administrator
        if (user.Id == currentUserId && (dto.Status == "Deactivated" || dto.Status == "Suspended"))
            throw new InvalidOperationException("You cannot deactivate or suspend your own administrator account.");

        var oldStatus = user.AccountStatus;
        user.AccountStatus = dto.Status;
        user.IsActive = (dto.Status == "Active");
        user.UpdatedAt = DateTime.UtcNow;

        if (dto.Status == "Deactivated" || dto.Status == "Suspended")
        {
            user.LockoutEnd = DateTime.MaxValue;
        }
        else if (dto.Status == "Active")
        {
            user.LockoutEnd = null;
            user.FailedLoginAttempts = 0;
        }

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "AccountStatusChanged",
            "Employees",
            $"Changed account status for {user.FullName} ({user.EmployeeId}) from {oldStatus} to {dto.Status}. Reason: {dto.Reason ?? "Not specified"}",
            resourceId: user.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );
    }

    public async Task ResetPasswordAsync(int id, ResetPasswordDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var user = await _context.Users.FindAsync(id)
            ?? throw new KeyNotFoundException("Employee not found.");

        if (string.IsNullOrWhiteSpace(dto.NewPassword) || dto.NewPassword.Length < 6)
            throw new InvalidOperationException("Password must be at least 6 characters long.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        user.MustChangePassword = true;
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "PasswordReset",
            "Employees",
            $"Reset credentials for employee {user.FullName} ({user.EmployeeId})",
            resourceId: user.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );
    }

    public async Task<List<StaffAvailabilityDto>> GetAvailabilityAsync(int userId)
    {
        return await _context.StaffAvailabilities
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.DayOfWeek)
            .Select(a => new StaffAvailabilityDto
            {
                Id = a.Id,
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                ShiftName = a.ShiftName,
                IsAvailable = a.IsAvailable,
                ClinicLocation = a.ClinicLocation
            })
            .ToListAsync();
    }

    public async Task UpdateAvailabilityAsync(int userId, List<StaffAvailabilityDto> availabilities, int currentUserId, string currentUserName, string currentUserRole)
    {
        var user = await _context.Users.FindAsync(userId)
            ?? throw new KeyNotFoundException("Employee not found.");

        var existing = await _context.StaffAvailabilities.Where(a => a.UserId == userId).ToListAsync();
        _context.StaffAvailabilities.RemoveRange(existing);

        foreach (var a in availabilities)
        {
            _context.StaffAvailabilities.Add(new StaffAvailability
            {
                UserId = userId,
                DayOfWeek = a.DayOfWeek,
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                ShiftName = string.IsNullOrWhiteSpace(a.ShiftName) ? "Standard" : a.ShiftName,
                IsAvailable = a.IsAvailable,
                ClinicLocation = a.ClinicLocation
            });
        }

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "AvailabilityUpdated",
            "Employees",
            $"Updated work schedule/availability for {user.FullName} ({user.EmployeeId})",
            resourceId: user.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );
    }

    public async Task<List<Role>> GetRolesAsync()
    {
        return await _context.Roles.OrderBy(r => r.Id).ToListAsync();
    }
}

