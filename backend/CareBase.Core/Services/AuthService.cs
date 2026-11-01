using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Shared.Permissions;
using CareBase.Core.Helpers;
using Microsoft.EntityFrameworkCore;
using CareBase.Core.Data;

namespace CareBase.Core.Services;

public class AuthService(AppDbContext context, JwtHelper jwt, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly JwtHelper _jwt = jwt;
    private readonly AuditService _audit = audit;

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Department)
            .FirstOrDefaultAsync(x => x.Email.ToLower() == request.Email.Trim().ToLower());

        if (user is null)
        {
            await _audit.LogAsync("LoginFailed", "Auth", $"Failed login attempt for nonexistent email: {request.Email}", result: "Failed");
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Check Account Lockout
        if (user.LockoutEnd.HasValue && user.LockoutEnd.Value > DateTime.UtcNow)
        {
            await _audit.LogAsync("LoginBlocked", "Auth", $"Login blocked for locked account: {user.Email}", resourceId: user.Id.ToString(), userId: user.Id, userName: user.FullName, result: "Blocked");
            var remaining = Math.Ceiling((user.LockoutEnd.Value - DateTime.UtcNow).TotalMinutes);
            throw new UnauthorizedAccessException($"Account is temporarily locked. Try again in {remaining} minute(s).");
        }

        // Check Account Lifecycle Status
        if (!user.IsActive || user.AccountStatus == "Deactivated" || user.AccountStatus == "Suspended" || user.AccountStatus == "Inactive")
        {
            await _audit.LogAsync("LoginDenied", "Auth", $"Login denied for {user.AccountStatus} account: {user.Email}", resourceId: user.Id.ToString(), userId: user.Id, userName: user.FullName, result: "Denied");
            throw new UnauthorizedAccessException($"Your account is {user.AccountStatus.ToLower()}. Please contact the facility administrator.");
        }

        // Verify password
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            user.FailedLoginAttempts++;
            if (user.FailedLoginAttempts >= 5)
            {
                user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
                user.AccountStatus = "Locked";
            }
            await _context.SaveChangesAsync();

            await _audit.LogAsync("LoginFailed", "Auth", $"Invalid password attempt ({user.FailedLoginAttempts}/5) for: {user.Email}", resourceId: user.Id.ToString(), userId: user.Id, userName: user.FullName, userRole: user.Role?.RoleName, result: "Failed");
            throw new UnauthorizedAccessException("Invalid credentials");
        }

        // Successful authentication
        user.FailedLoginAttempts = 0;
        user.LockoutEnd = null;
        if (user.AccountStatus == "Locked")
            user.AccountStatus = "Active";
        user.LastLogin = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var token = _jwt.GenerateToken(user);
        var roleName = user.Role?.RoleName ?? "Clerk";
        var permissions = AppPermissions.GetRolePermissions(roleName).ToList();

        await _audit.LogAsync("Login", "Auth", $"Successful login for {user.FullName} ({roleName})", resourceId: user.Id.ToString(), userId: user.Id, userName: user.FullName, userRole: roleName);

        return new LoginResponse
        {
            UserId = user.Id,
            Token = token,
            Role = roleName,
            FullName = user.FullName,
            PreferredName = user.PreferredName,
            Email = user.Email,
            EmployeeId = user.EmployeeId,
            DepartmentName = user.Department?.Name,
            Permissions = permissions,
            MustChangePassword = user.MustChangePassword
        };
    }

    public async Task Logout(int userId)
    {
        var user = await _context.Users.Include(u => u.Role).FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            await _audit.LogAsync("Logout", "Auth", $"User logged out: {user.FullName}", resourceId: user.Id.ToString(), userId: user.Id, userName: user.FullName, userRole: user.Role?.RoleName);
        }
    }
}
