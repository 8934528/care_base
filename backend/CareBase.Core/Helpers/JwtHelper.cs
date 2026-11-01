using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using CareBase.Core.Entities;
using CareBase.Shared.Permissions;
using Microsoft.Extensions.Configuration;

namespace CareBase.Core.Helpers;

public class JwtHelper(IConfiguration config)
{
    public string GenerateToken(User user)
    {
        var secret = Environment.GetEnvironmentVariable("JWT_SECRET") 
                     ?? config["Jwt:Key"] 
                     ?? throw new InvalidOperationException("JWT Secret is missing in configuration");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var roleName = user.Role?.RoleName ?? "Clerk";
        var permissions = AppPermissions.GetRolePermissions(roleName);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, roleName),
            new(ClaimTypes.Name, user.FullName),
            new("employee_id", user.EmployeeId ?? string.Empty),
            new("department_id", user.DepartmentId?.ToString() ?? string.Empty),
            new("account_status", user.AccountStatus)
        };

        foreach (var perm in permissions)
        {
            claims.Add(new Claim("permission", perm));
        }

        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? config["Jwt:Issuer"] ?? "CareBaseAPI";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? config["Jwt:Audience"] ?? "CareBaseClient";
        
        var expiryHours = 8;
        if (int.TryParse(Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS"), out var parsedExpiry))
        {
            expiryHours = parsedExpiry;
        }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expiryHours),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
