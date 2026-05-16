using CareBase.Infrastructure.Data;
using CareBase.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotesController : ControllerBase
{
    private readonly AppDbContext _context;

    public NotesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{patientId}")]
    public async Task<IActionResult> GetNotes(int patientId)
    {
        var notes = await _context.Notes
            .Include(n => n.Author)
            .Where(n => n.PatientId == patientId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
        return Ok(notes);
    }

    [HttpPost]
    public async Task<IActionResult> AddNote([FromBody] Note note)
    {
        var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdString, out int userId))
        {
            note.AuthorId = userId;
        }

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();
        return Ok(note);
    }
}
