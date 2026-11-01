using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/queue")]
[Authorize]
public class QueueController(QueueService service) : ControllerBase
{
    private readonly QueueService _service = service;

    private (int UserId, string UserName, string UserRole) GetCurrentUser()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var id);
        var name = User.FindFirstValue(ClaimTypes.Name) ?? "Staff";
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Nurse";
        return (id, name, role);
    }

    [HttpPost]
    public async Task<IActionResult> Add(AddToQueueDto dto)
    {
        try
        {
            var user = GetCurrentUser();
            var result = await _service.AddToQueue(dto, user.UserId, user.UserName, user.UserRole);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = ex.Message });
        }
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var result = await _service.GetQueue();
        return Ok(result);
    }

    [HttpPost("call-next")]
    public async Task<IActionResult> CallNext()
    {
        var user = GetCurrentUser();
        var result = await _service.CallNext(user.UserId, user.UserName, user.UserRole);

        if (result == null)
            return NotFound(new { message = "Queue is empty." });

        return Ok(result);
    }

    [HttpPost("complete/{id}")]
    public async Task<IActionResult> Complete(int id)
    {
        var user = GetCurrentUser();
        await _service.CompleteQueue(id, user.UserId, user.UserName, user.UserRole);
        return Ok(new { message = "Queue item completed." });
    }

    [HttpPost("skip/{id}")]
    public async Task<IActionResult> Skip(int id)
    {
        var user = GetCurrentUser();
        await _service.SkipQueue(id, user.UserId, user.UserName, user.UserRole);
        return Ok(new { message = "Queue item skipped." });
    }

    [HttpPost("cancel/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var user = GetCurrentUser();
        await _service.CancelQueue(id, user.UserId, user.UserName, user.UserRole);
        return Ok(new { message = "Queue item cancelled." });
    }
}
