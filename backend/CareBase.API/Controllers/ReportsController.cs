using CareBase.Core.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Doctor,Clerk")]
public class ReportsController(DashboardService service) : ControllerBase
{
    private readonly DashboardService _service = service;

    [HttpGet]
    public async Task<IActionResult> GetReports()
    {
        var reports = await _service.GetReports();
        return Ok(reports);
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var reports = await _service.GetReports();
        return Ok(new
        {
            reports.TotalPatients,
            reports.TodayAppointments,
            reports.CurrentQueue
        });
    }
}
