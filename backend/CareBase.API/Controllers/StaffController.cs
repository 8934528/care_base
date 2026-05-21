using CareBase.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StaffController(StaffService service) : ControllerBase
{
    private readonly StaffService _service = service;

    [HttpGet("doctors")]
    public async Task<IActionResult> GetDoctors([FromQuery] bool todayOnly = false)
    {
        var doctors = todayOnly
            ? await _service.GetAvailableDoctorsAsync()
            : await _service.GetAllDoctorsAsync();

        return Ok(doctors);
    }

    [HttpGet("doctors/{doctorId}/available-dates")]
    public async Task<IActionResult> GetDoctorAvailableDates(int doctorId)
    {
        var result = await _service.GetDoctorAvailableDatesAsync(doctorId);
        if (result == null)
            return NotFound(new { message = "Doctor not found." });

        return Ok(result);
    }
}
