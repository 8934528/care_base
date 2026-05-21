using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CareBase.Core.Services;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize(Roles = "Admin,Clerk")]
public class NotificationsController(NotificationService service) : ControllerBase
{
    private readonly NotificationService _service = service;

    [HttpGet]
    public async Task<IActionResult> GetRecent()
    {
        var notifications = await _service.GetRecentAsync();
        return Ok(notifications);
    }
}
