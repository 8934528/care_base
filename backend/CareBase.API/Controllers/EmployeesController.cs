using System.Security.Claims;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Manager")]
public class EmployeesController(EmployeeService service) : ControllerBase
{
    private readonly EmployeeService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Admin";
        return (id, name, role);
    }

    [HttpGet]
    public async Task<IActionResult> GetEmployees(
        [FromQuery] string? search,
        [FromQuery] int? departmentId,
        [FromQuery] string? role,
        [FromQuery] string? status,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 15)
    {
        var result = await _service.GetEmployeesAsync(search, departmentId, role, status, page, pageSize);
        return Ok(new
        {
            items = result.Employees,
            totalCount = result.TotalCount,
            activeCount = result.ActiveCount,
            inactiveCount = result.InactiveCount,
            pendingCount = result.PendingCount,
            page,
            pageSize
        });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEmployee(int id)
    {
        var emp = await _service.GetEmployeeByIdAsync(id);
        if (emp == null)
            return NotFound(new { message = "Employee not found." });

        return Ok(emp);
    }

    [HttpPost]
    public async Task<IActionResult> CreateEmployee([FromBody] CreateEmployeeDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.CreateEmployeeAsync(dto, user.UserId, user.UserName, user.UserRole);
            return CreatedAtAction(nameof(GetEmployee), new { id = result.Id }, result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.UpdateEmployeeAsync(id, dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateAccountStatus(int id, [FromBody] UpdateAccountStatusDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            await _service.UpdateAccountStatusAsync(id, dto, user.UserId, user.UserName, user.UserRole);
            return Ok(new { message = $"Employee account status updated to {dto.Status}." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/reset-password")]
    public async Task<IActionResult> ResetPassword(int id, [FromBody] ResetPasswordDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            await _service.ResetPasswordAsync(id, dto, user.UserId, user.UserName, user.UserRole);
            return Ok(new { message = "Employee credentials reset successfully." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/availability")]
    public async Task<IActionResult> GetAvailability(int id)
    {
        var list = await _service.GetAvailabilityAsync(id);
        return Ok(list);
    }

    [HttpPut("{id}/availability")]
    public async Task<IActionResult> UpdateAvailability(int id, [FromBody] List<StaffAvailabilityDto> availabilities)
    {
        try
        {
            var user = GetCurrentUser();
            await _service.UpdateAvailabilityAsync(id, availabilities, user.UserId, user.UserName, user.UserRole);
            return Ok(new { message = "Staff availability schedule updated." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _service.GetRolesAsync();
        return Ok(roles);
    }
}

