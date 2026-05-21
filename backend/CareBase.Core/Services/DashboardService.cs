using CareBase.Core.Data;
using CareBase.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class DashboardService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<DashboardStatsDto> GetDashboard()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var dailyVisits = await _context.MedicalRecords
            .CountAsync(x => x.VisitDate >= today && x.VisitDate < tomorrow);

        var queueLoad = await _context.Queue
            .CountAsync(x => x.Status == "Waiting" || x.Status == "InProgress");

        var onDutyDoctorIds = await _context.StaffAvailabilities
            .Where(a => a.DayOfWeek == today.DayOfWeek)
            .Select(a => a.UserId)
            .Distinct()
            .CountAsync();

        var activeDoctors = onDutyDoctorIds > 0
            ? onDutyDoctorIds
            : await _context.Users.CountAsync(u => u.IsActive && u.Role.RoleName == "Doctor");

        var completedConsultations = await _context.Queue
            .CountAsync(x =>
                x.Status == "Completed" &&
                x.CompletedTime.HasValue &&
                x.CompletedTime.Value >= today &&
                x.CompletedTime.Value < tomorrow);

        var diseaseTrends = await _context.MedicalRecords
            .Where(x => !string.IsNullOrEmpty(x.Assessment))
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

    public async Task<ReportsDto> GetReports()
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);
        var dashboard = await GetDashboard();

        var monthlyVisits = await _context.MedicalRecords
            .GroupBy(x => new { x.VisitDate.Year, x.VisitDate.Month })
            .Select(g => new MonthlyTrendDto
            {
                Month = $"{g.Key.Year}-{g.Key.Month:D2}",
                TotalVisits = g.Count()
            })
            .OrderBy(x => x.Month)
            .Take(12)
            .ToListAsync();

        return new ReportsDto
        {
            TotalPatients = await _context.Patients.CountAsync(),
            TodayAppointments = await _context.Appointments
                .CountAsync(a => a.AppointmentDate >= today && a.AppointmentDate < tomorrow),
            CurrentQueue = await _context.Queue
                .CountAsync(q => q.Status == "Waiting" || q.Status == "InProgress"),
            CompletedToday = dashboard.CompletedConsultations,
            DiseaseTrends = dashboard.DiseaseTrends,
            GenderStats = dashboard.GenderStats,
            AppointmentStats = dashboard.AppointmentStats,
            MonthlyVisits = monthlyVisits
        };
    }
}
