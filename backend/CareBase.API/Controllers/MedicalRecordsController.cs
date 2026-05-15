using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MedicalRecordsController : ControllerBase
{
    private readonly AppDbContext _context;

    public MedicalRecordsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{patientId}")]
    public async Task<IActionResult> GetPatientRecords(int patientId)
    {
        var records = await _context.MedicalRecords
            .Include(r => r.CreatedBy)
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(records);
    }

    [HttpPost]
    [Authorize(Roles = "Doctor")]
    public async Task<IActionResult> AddRecord([FromBody] MedicalRecord record)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out int userId))
        {
            record.CreatedById = userId;
        }

        _context.MedicalRecords.Add(record);
        await _context.SaveChangesAsync();
        return Ok(record);
    }
}
