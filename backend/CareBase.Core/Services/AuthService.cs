using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Helpers;
using Microsoft.EntityFrameworkCore;
using CareBase.Core.Data;

namespace CareBase.Core.Services;

public class AuthService(AppDbContext context, JwtHelper jwt)
{
    private readonly AppDbContext _context = context;
    private readonly JwtHelper _jwt = jwt;

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user is null)
            throw new Exception("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        var token = _jwt.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            Role = user.Role?.RoleName ?? "Clerk",
            FullName = user.FullName
        };
    }

    public async Task<LoginResponse> Register(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            throw new Exception("Email already exists");

        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == request.Role);
        if (role is null)
            throw new Exception("Invalid role");

        var user = new User
        {
            FullName = request.FullName,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            RoleId = role.Id,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwt.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            Role = role.RoleName,
            FullName = user.FullName
        };
    }
}
