using CareBase.Core.Data;
using CareBase.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class DashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboard()
    {
        var today = DateTime.Today;

        var dailyVisits = await _context.MedicalRecords
            .CountAsync(x => x.VisitDate.Date == today);

        var queueLoad = await _context.Queue
            .CountAsync(x => x.Status == "Waiting");

        var activeDoctors = await _context.MedicalRecords
            .Where(x => x.VisitDate.Date == today)
            .Select(x => x.DoctorId)
            .Distinct()
            .CountAsync();

        var completedConsultations = await _context.Queue
            .CountAsync(x =>
                x.Status == "Completed" &&
                x.CompletedTime.HasValue && 
                x.CompletedTime.Value.Date == today);

        var diseaseTrends = await _context.MedicalRecords
            .Where(x => x.Assessment != null)
            .GroupBy(x => x.Assessment)
            .Select(g => new DiseaseTrendDto
            {
                Disease = g.Key,
                TotalCases = g.Count()
            })
            .OrderByDescending(x => x.TotalCases)
            .Take(5)
            .ToListAsync();

        var genderStats = await _context.Patients
            .GroupBy(x => x.Gender)
            .Select(g => new GenderStatsDto
            {
                Gender = g.Key ?? "Unknown",
                Total = g.Count()
            })
            .ToListAsync();

        var appointmentStats = await _context.Appointments
            .GroupBy(x => x.Status)
            .Select(g => new AppointmentStatsDto
            {
                Status = g.Key,
                Total = g.Count()
            })
            .ToListAsync();

        return new DashboardStatsDto
        {
            DailyVisits = dailyVisits,
            QueueLoad = queueLoad,
            ActiveDoctors = activeDoctors,
            CompletedConsultations = completedConsultations,
            DiseaseTrends = diseaseTrends,
            GenderStats = genderStats,
            AppointmentStats = appointmentStats
        };
    }
}
