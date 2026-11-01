using CareBase.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/audit-logs")]
[Authorize(Roles = "Admin,Manager")]
public class AuditLogsController(AuditService audit) : ControllerBase
{
    private readonly AuditService _audit = audit;

    [HttpGet]
    public async Task<IActionResult> GetLogs(
        [FromQuery] string? module,
        [FromQuery] string? action,
        [FromQuery] string? search,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _audit.GetLogsAsync(module, action, search, from, to, page, pageSize);
        return Ok(new
        {
            items = result.Logs.Select(l => new
            {
                l.Id,
                l.UserId,
                l.UserName,
                l.UserRole,
                l.Action,
                l.Module,
                l.ResourceId,
                l.IpAddress,
                l.Details,
                l.Result,
                l.Timestamp
            }),
            totalCount = result.TotalCount,
            page,
            pageSize
        });
    }
}

