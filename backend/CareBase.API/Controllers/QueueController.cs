using Microsoft.AspNetCore.Mvc;
using CareBase.Core.Services;
using CareBase.Shared.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/queue")]
[Authorize]
public class QueueController(QueueService service) : ControllerBase
{
    private readonly QueueService _service = service;

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] AddToQueueDto dto)
    {
        var result = await _service.AddToQueue(dto);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var queue = await _service.GetQueue();
        return Ok(queue);
    }

    [HttpPost("call-next")]
    public async Task<IActionResult> CallNext()
    {
        var role = User.Identity?.Name ?? "Staff";
        var result = await _service.CallNext(role);

        if (result == null)
            return NotFound("No patients in queue");

        return Ok(result);
    }

    [HttpPost("complete/{id}")]
    public async Task<IActionResult> Complete(int id)
    {
        await _service.CompleteQueue(id);
        return Ok();
    }

    [HttpPost("skip/{id}")]
    public async Task<IActionResult> Skip(int id)
    {
        await _service.SkipQueue(id);
        return Ok();
    }
}
