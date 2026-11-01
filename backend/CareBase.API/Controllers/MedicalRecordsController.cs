using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/records")]
[Authorize(Roles = "Doctor,Nurse,Admin,Manager")]
public class MedicalRecordsController(MedicalRecordService service) : ControllerBase
{
    private readonly MedicalRecordService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "System";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Doctor";
        return (id, name, role);
    }

    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> Create(CreateMedicalRecordDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.CreateRecord(dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("patient/{patientId}")]
    public async Task<IActionResult> PatientHistory(int patientId)
    {
        var user = GetCurrentUser();
        var result = await _service.GetPatientHistory(patientId, user.UserId, user.UserName, user.UserRole);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id)
    {
        var user = GetCurrentUser();
        var result = await _service.GetRecord(id, user.UserId, user.UserName, user.UserRole);

        if (result == null)
            return NotFound(new { message = "Record not found." });

        return Ok(result);
    }

    public class AmendRecordRequest
    {
        public required CreateMedicalRecordDto Record { get; set; }
        public required string Reason { get; set; }
    }

    [HttpPut("{id}/amend")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> Amend(int id, [FromBody] AmendRecordRequest req)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.AmendRecord(id, req.Record, req.Reason, user.UserId, user.UserName, user.UserRole);
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
}
