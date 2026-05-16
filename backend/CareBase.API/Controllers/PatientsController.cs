using Microsoft.AspNetCore.Mvc;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/patients")]
[Authorize(Roles = "Admin,Doctor,Nurse,Clerk")]
public class PatientsController : ControllerBase
{
    private readonly PatientService _service;

    public PatientsController(PatientService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Register([FromBody] CreatePatientDto dto)
    {
        try
        {
            var patient = await _service.RegisterPatient(dto);
            return Ok(new
            {
                patient.PatientRef,
                FullName = $"{patient.FirstName} {patient.LastName}"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string keyword)
    {
        var results = await _service.SearchPatients(keyword);
        return Ok(results);
    }

    [HttpGet("{patientRef}")]
    public async Task<IActionResult> Get(string patientRef)
    {
        var patient = await _service.GetByRef(patientRef);

        if (patient == null)
            return NotFound();

        return Ok(patient);
    }
}
