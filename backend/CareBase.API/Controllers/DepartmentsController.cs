using System.Security.Claims;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DepartmentsController(DepartmentService service) : ControllerBase
{
    private readonly DepartmentService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Admin";
        return (id, name, role);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var list = await _service.GetAllAsync();
        return Ok(list);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.CreateAsync(dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateDepartmentDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.UpdateAsync(id, dto, user.UserId, user.UserName, user.UserRole);
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
}

