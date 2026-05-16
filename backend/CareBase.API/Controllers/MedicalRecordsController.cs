using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/medical-records")]
[Authorize(Roles = "Doctor,Nurse,Admin")]
public class MedicalRecordsController : ControllerBase
{
    private readonly MedicalRecordService _service;

    public MedicalRecordsController(MedicalRecordService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateMedicalRecordDto dto)
    {
        try
        {
            var result = await _service.CreateRecord(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> History(int patientId)
    {
        var history = await _service.GetPatientHistory(patientId);
        return Ok(history);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var record = await _service.GetRecord(id);

        if (record == null)
            return NotFound();

        return Ok(record);
    }
}
