using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CareBase.Core.Services;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController(DashboardService service) : ControllerBase
{
    private readonly DashboardService _service = service;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var idStr = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0";
        int.TryParse(idStr, out var currentUserId);
        var role = User.FindFirstValue(ClaimTypes.Role) ?? "Admin";

        var result = await _service.GetDashboard(currentUserId, role);
        return Ok(result);
    }
}
