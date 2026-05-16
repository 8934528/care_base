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

    [HttpPost]
    public async Task<IActionResult> Create(CreateAppointmentDto dto)
    {
        try
        {
            var result = await _service.CreateAppointment(dto);
            return Ok(result);
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
        await _service.UpdateStatus(id, status);
        return Ok();
    }
}
