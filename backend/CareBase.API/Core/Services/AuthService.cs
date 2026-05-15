using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Shared.Helpers;
using Microsoft.EntityFrameworkCore;
using CareBase.Core.Data;

namespace CareBase.Core.Services;

public class AuthService
{
    private readonly AppDbContext _context;
    private readonly JwtHelper _jwt;

    public AuthService(AppDbContext context, JwtHelper jwt)
    {
        _context = context;
        _jwt = jwt;
    }

    public async Task<LoginResponse> Login(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(x => x.Email == request.Email);

        if (user == null)
            throw new Exception("Invalid credentials");

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new Exception("Invalid credentials");

        var token = _jwt.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            Role = user.Role,
            FullName = user.FullName
        };
    }
}
