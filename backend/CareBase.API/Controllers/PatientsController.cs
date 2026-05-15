using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PatientsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPatients([FromQuery] string search)
    {
        var query = _context.Patients.AsQueryable();
        
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => 
                p.FirstName.Contains(search) || 
                p.LastName.Contains(search) || 
                p.IdNumber.Contains(search) || 
                p.ReferenceNumber.Contains(search));
        }

        var patients = await query.ToListAsync();
        return Ok(patients);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePatient([FromBody] Patient patient)
    {
        _context.Patients.Add(patient);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetPatients), new { id = patient.Id }, patient);
    }
}
