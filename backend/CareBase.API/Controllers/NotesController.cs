using CareBase.Core.Data;
using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Nurse")]
public class NotesController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet("{patientId}")]
    public async Task<IActionResult> GetNotes(int patientId)
    {
        var notes = await _context.Notes
            .Include(n => n.Author)
            .ThenInclude(u => u.Role)
            .Where(n => n.PatientId == patientId)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NoteResponseDto
            {
                Id = n.Id,
                Content = n.NoteContent,
                AuthorName = n.Author.FullName,
                AuthorRole = n.Author.Role.RoleName,
                CreatedAt = n.CreatedAt
            })
            .ToListAsync();

        return Ok(notes);
    }

    [HttpPost]
    public async Task<IActionResult> AddNote([FromBody] CreateNoteDto dto)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!int.TryParse(userIdString, out var userId))
            return Unauthorized(new { message = "Could not identify the logged-in user." });

        var note = new Note
        {
            PatientId = dto.PatientId,
            AuthorId = userId,
            NoteType = string.IsNullOrWhiteSpace(dto.NoteType) ? "Clinical" : dto.NoteType,
            NoteContent = dto.NoteContent,
            CreatedAt = DateTime.UtcNow
        };

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        var author = await _context.Users
            .Include(u => u.Role)
            .FirstAsync(u => u.Id == userId);

        return Ok(new NoteResponseDto
        {
            Id = note.Id,
            Content = note.NoteContent,
            AuthorName = author.FullName,
            AuthorRole = author.Role.RoleName,
            CreatedAt = note.CreatedAt
        });
    }
}
