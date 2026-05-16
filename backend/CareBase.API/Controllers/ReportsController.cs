using CareBase.Core.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController(AppDbContext context) : ControllerBase
{
    private readonly AppDbContext _context = context;

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var todayAppointments = await _context.Appointments
            .Where(a => a.AppointmentDate.Date == DateTime.Today)
            .CountAsync();
        var currentQueue = await _context.Queue
            .Where(q => q.Status != "Completed")
            .CountAsync();

        return Ok(new
        {
            TotalPatients = totalPatients,
            TodayAppointments = todayAppointments,
            CurrentQueue = currentQueue
        });
    }
}
