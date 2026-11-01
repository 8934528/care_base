using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/patients")]
[Authorize(Roles = "Admin,Manager,Doctor,Nurse,Clerk")]
public class PatientsController(PatientService service) : ControllerBase
{
    private readonly PatientService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Staff";
        return (id, name, role);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Clerk,Nurse")]
    public async Task<IActionResult> Register(CreatePatientDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.RegisterPatient(dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Clerk,Nurse")]
    public async Task<IActionResult> Update(int id, [FromBody] CreatePatientDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.UpdatePatient(id, dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string? keyword)
    {
        var result = await _service.SearchPatients(keyword ?? "");
        return Ok(result);
    }

    [HttpGet("ref/{patientRef}")]
    public async Task<IActionResult> ByRef(string patientRef)
    {
        var user = GetCurrentUser();
        var result = await _service.GetPatientByRef(patientRef, user.UserId, user.UserName, user.UserRole);

        if (result == null)
            return NotFound(new { message = "Patient not found." });

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> ById(int id)
    {
        var result = await _service.GetPatientById(id);
        if (result == null)
            return NotFound(new { message = "Patient not found." });

        return Ok(result);
    }
}
