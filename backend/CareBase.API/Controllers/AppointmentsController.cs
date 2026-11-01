using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/appointments")]
[Authorize]
public class AppointmentsController(AppointmentService service) : ControllerBase
{
    private readonly AppointmentService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "Staff";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Clerk";
        return (id, name, role);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.CreateAppointment(dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("date/{date}")]
    public async Task<IActionResult> ByDate(DateTime date)
    {
        var result = await _service.GetAppointmentsByDate(date);
        return Ok(result);
    }

    [HttpGet("doctor/{doctorId}")]
    public async Task<IActionResult> DoctorAppointments(int doctorId)
    {
        var result = await _service.GetDoctorAppointments(doctorId);
        return Ok(result);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status)
    {
        try
        {
            var user = GetCurrentUser();
            await _service.UpdateStatus(id, status, user.UserId, user.UserName, user.UserRole);
            return Ok(new { message = "Appointment status updated." });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}
