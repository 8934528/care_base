using CareBase.Core.Data;
using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class DepartmentService(AppDbContext context, AuditService audit)
{
    private readonly AppDbContext _context = context;
    private readonly AuditService _audit = audit;

    public async Task<List<DepartmentDto>> GetAllAsync()
    {
        return await _context.Departments
            .OrderBy(d => d.Name)
            .Select(d => new DepartmentDto
            {
                Id = d.Id,
                Name = d.Name,
                Code = d.Code,
                Description = d.Description,
                IsActive = d.IsActive,
                EmployeeCount = _context.Users.Count(u => u.DepartmentId == d.Id && u.IsActive)
            })
            .ToListAsync();
    }

    public async Task<DepartmentDto> CreateAsync(CreateDepartmentDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var code = dto.Code.Trim().ToUpper();
        if (await _context.Departments.AnyAsync(d => d.Code == code))
            throw new InvalidOperationException($"Department code '{code}' already exists.");

        var dept = new Department
        {
            Name = dto.Name.Trim(),
            Code = code,
            Description = dto.Description?.Trim(),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Departments.Add(dept);
        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "DepartmentCreated",
            "Departments",
            $"Created department {dept.Name} ({dept.Code})",
            resourceId: dept.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return new DepartmentDto
        {
            Id = dept.Id,
            Name = dept.Name,
            Code = dept.Code,
            Description = dept.Description,
            IsActive = dept.IsActive,
            EmployeeCount = 0
        };
    }

    public async Task<DepartmentDto> UpdateAsync(int id, CreateDepartmentDto dto, int currentUserId, string currentUserName, string currentUserRole)
    {
        var dept = await _context.Departments.FindAsync(id)
            ?? throw new KeyNotFoundException("Department not found.");

        var code = dto.Code.Trim().ToUpper();
        if (await _context.Departments.AnyAsync(d => d.Code == code && d.Id != id))
            throw new InvalidOperationException($"Department code '{code}' already in use.");

        dept.Name = dto.Name.Trim();
        dept.Code = code;
        dept.Description = dto.Description?.Trim();

        await _context.SaveChangesAsync();

        await _audit.LogAsync(
            "DepartmentUpdated",
            "Departments",
            $"Updated department {dept.Name} ({dept.Code})",
            resourceId: dept.Id.ToString(),
            userId: currentUserId,
            userName: currentUserName,
            userRole: currentUserRole
        );

        return new DepartmentDto
        {
            Id = dept.Id,
            Name = dept.Name,
            Code = dept.Code,
            Description = dept.Description,
            IsActive = dept.IsActive,
            EmployeeCount = await _context.Users.CountAsync(u => u.DepartmentId == dept.Id && u.IsActive)
        };
    }
}

