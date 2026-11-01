using CareBase.Core.Data;
using CareBase.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class DashboardService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<DashboardStatsDto> GetDashboard(int currentUserId, string roleName)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var dailyVisits = await _context.MedicalRecords
            .CountAsync(x => x.VisitDate >= today && x.VisitDate < tomorrow);

        var queueLoad = await _context.Queue
            .CountAsync(x => x.Status == "Waiting" || x.Status == "InProgress" || x.Status == "InConsultation");

        var onDutyDoctorIds = await _context.StaffAvailabilities
            .Where(a => a.DayOfWeek == today.DayOfWeek && a.IsAvailable)
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

        var totalPatients = await _context.Patients.CountAsync();
        var totalEmployees = await _context.Users.CountAsync();
        var activeEmployees = await _context.Users.CountAsync(u => u.IsActive);
        var todayAppointments = await _context.Appointments.CountAsync(a => a.AppointmentDate.Date == today && a.Status != "Cancelled");

        var pendingFollowUps = await _context.MedicalRecords
            .CountAsync(r => r.FollowUpDate.HasValue && r.FollowUpDate.Value >= today && r.FollowUpDate.Value <= today.AddDays(7));

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
                Gender = g.Key,
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

        // Role-specific lists
        var roleAppointments = new List<AppointmentSummaryDto>();
        var roleQueue = new List<QueueSummaryDto>();
        var securityEvents = new List<AuditLogItemDto>();

        if (roleName == "Doctor")
        {
            var appts = await _context.Appointments
                .Where(a => a.DoctorId == currentUserId && a.AppointmentDate.Date == today)
                .OrderBy(a => a.StartTime)
                .Take(10)
                .ToListAsync();

            var patientIds = appts.Select(a => a.PatientId).Distinct().ToList();
            var patients = await _context.Patients.Where(p => patientIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => $"{p.FirstName} {p.LastName}");

            roleAppointments = appts.Select(a => new AppointmentSummaryDto
            {
                Id = a.Id,
                AppointmentRef = a.AppointmentRef,
                PatientId = a.PatientId,
                PatientName = patients.GetValueOrDefault(a.PatientId, $"Patient #{a.PatientId}"),
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                AppointmentType = a.AppointmentType,
                Priority = a.Priority,
                Status = a.Status,
                Reason = a.Reason
            }).ToList();

            var qItems = await _context.Queue
                .Where(q => (q.Status == "Waiting" || q.Status == "InProgress") && q.CheckInTime >= today)
                .OrderByDescending(q => q.Priority == "Emergency")
                .ThenBy(q => q.CheckInTime)
                .Take(10)
                .ToListAsync();

            roleQueue = qItems.Select(q => new QueueSummaryDto
            {
                Id = q.Id,
                QueueNumber = q.QueueNumber,
                PatientId = q.PatientId,
                PatientRef = q.PatientRef,
                Priority = q.Priority,
                Status = q.Status,
                AssignedTo = q.AssignedTo,
                CheckInTime = q.CheckInTime
            }).ToList();
        }
        else if (roleName == "Nurse")
        {
            var qItems = await _context.Queue
                .Where(q => (q.Status == "Waiting" || q.Status == "InProgress") && q.CheckInTime >= today)
                .OrderByDescending(q => q.Priority == "Emergency")
                .ThenBy(q => q.CheckInTime)
                .Take(15)
                .ToListAsync();

            roleQueue = qItems.Select(q => new QueueSummaryDto
            {
                Id = q.Id,
                QueueNumber = q.QueueNumber,
                PatientId = q.PatientId,
                PatientRef = q.PatientRef,
                Priority = q.Priority,
                Status = q.Status,
                AssignedTo = q.AssignedTo,
                CheckInTime = q.CheckInTime
            }).ToList();
        }
        else if (roleName == "Clerk")
        {
            var appts = await _context.Appointments
                .Where(a => a.AppointmentDate.Date == today)
                .OrderBy(a => a.StartTime)
                .Take(10)
                .ToListAsync();

            var patientIds = appts.Select(a => a.PatientId).Distinct().ToList();
            var patients = await _context.Patients.Where(p => patientIds.Contains(p.Id)).ToDictionaryAsync(p => p.Id, p => $"{p.FirstName} {p.LastName}");

            roleAppointments = appts.Select(a => new AppointmentSummaryDto
            {
                Id = a.Id,
                AppointmentRef = a.AppointmentRef,
                PatientId = a.PatientId,
                PatientName = patients.GetValueOrDefault(a.PatientId, $"Patient #{a.PatientId}"),
                StartTime = a.StartTime,
                EndTime = a.EndTime,
                AppointmentType = a.AppointmentType,
                Priority = a.Priority,
                Status = a.Status,
                Reason = a.Reason
            }).ToList();

            var qItems = await _context.Queue
                .Where(q => q.Status == "Waiting" && q.CheckInTime >= today)
                .OrderBy(q => q.CheckInTime)
                .Take(10)
                .ToListAsync();

            roleQueue = qItems.Select(q => new QueueSummaryDto
            {
                Id = q.Id,
                QueueNumber = q.QueueNumber,
                PatientId = q.PatientId,
                PatientRef = q.PatientRef,
                Priority = q.Priority,
                Status = q.Status,
                AssignedTo = q.AssignedTo,
                CheckInTime = q.CheckInTime
            }).ToList();
        }
        else // Admin or Manager
        {
            var logs = await _context.AuditLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(8)
                .Select(l => new AuditLogItemDto
                {
                    Id = l.Id,
                    UserName = l.UserName,
                    UserRole = l.UserRole,
                    Action = l.Action,
                    Module = l.Module,
                    ResourceId = l.ResourceId,
                    Details = l.Details,
                    Result = l.Result,
                    Timestamp = l.Timestamp
                })
                .ToListAsync();

            securityEvents = logs;
        }

        return new DashboardStatsDto
        {
            DailyVisits = dailyVisits,
            QueueLoad = queueLoad,
            ActiveDoctors = activeDoctors,
            CompletedConsultations = completedConsultations,
            TotalPatients = totalPatients,
            TotalEmployees = totalEmployees,
            ActiveEmployees = activeEmployees,
            TodayAppointments = todayAppointments,
            PendingFollowUps = pendingFollowUps,
            RoleAppointments = roleAppointments,
            RoleQueueItems = roleQueue,
            RecentSecurityEvents = securityEvents,
            DiseaseTrends = diseaseTrends,
            GenderStats = genderStats,
            AppointmentStats = appointmentStats
        };
    }

    public async Task<ReportsDto> GetReports()
    {
        var totalPatients = await _context.Patients.CountAsync();
        var todayAppointments = await _context.Appointments.CountAsync(a => a.AppointmentDate.Date == DateTime.UtcNow.Date);
        var currentQueue = await _context.Queue.CountAsync(q => q.Status == "Waiting");
        var completedToday = await _context.Queue.CountAsync(q => q.Status == "Completed" && q.CompletedTime.HasValue && q.CompletedTime.Value.Date == DateTime.UtcNow.Date);

        var diseaseTrends = await _context.MedicalRecords
            .Where(x => !string.IsNullOrEmpty(x.Assessment))
            .GroupBy(x => x.Assessment)
            .Select(g => new DiseaseTrendDto
            {
                Disease = g.Key,
                TotalCases = g.Count()
            })
            .OrderByDescending(x => x.TotalCases)
            .Take(10)
            .ToListAsync();

        var appointmentStats = await _context.Appointments
            .GroupBy(x => x.Status)
            .Select(g => new AppointmentStatsDto
            {
                Status = g.Key,
                Total = g.Count()
            })
            .ToListAsync();

        var genderStats = await _context.Patients
            .GroupBy(x => x.Gender)
            .Select(g => new GenderStatsDto
            {
                Gender = g.Key,
                Total = g.Count()
            })
            .ToListAsync();

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
            TotalPatients = totalPatients,
            TodayAppointments = todayAppointments,
            CurrentQueue = currentQueue,
            CompletedToday = completedToday,
            DiseaseTrends = diseaseTrends,
            GenderStats = genderStats,
            AppointmentStats = appointmentStats,
            MonthlyVisits = monthlyVisits
        };
    }
}
