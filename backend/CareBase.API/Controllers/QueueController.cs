using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QueueController : ControllerBase
{
    private readonly AppDbContext _context;

    public QueueController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetQueue()
    {
        var queue = await _context.Queue
            .Include(q => q.Patient)
            .Where(q => q.Status != "Completed")
            .OrderBy(q => q.Priority == "Urgent" ? 0 : 1)
            .ThenBy(q => q.JoinedAt)
            .ToListAsync();
        return Ok(queue);
    }

    [HttpPost]
    public async Task<IActionResult> AddToQueue([FromBody] QueueEntry entry)
    {
        _context.Queue.Add(entry);
        await _context.SaveChangesAsync();
        return Ok(entry);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
    {
        var entry = await _context.Queue.FindAsync(id);
        if (entry == null) return NotFound();

        entry.Status = status;
        await _context.SaveChangesAsync();
        return Ok(entry);
    }
}
