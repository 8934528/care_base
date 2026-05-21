using CareBase.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController(DashboardService service) : ControllerBase
{
    private readonly DashboardService _service = service;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var stats = await _service.GetDashboard();
        return Ok(stats);
    }
}
