using CareBase.Core.Data;
using CareBase.Shared.DTOs;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class StaffService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task<List<DoctorListItemDto>> GetAvailableDoctorsAsync()
    {
        var today = DateTime.UtcNow.DayOfWeek;

        var onDutyDoctorIds = await _context.StaffAvailabilities
            .Where(a => a.DayOfWeek == today)
            .Select(a => a.UserId)
            .Distinct()
            .ToListAsync();

        return await _context.Users
            .Include(u => u.Role)
            .Where(u => u.IsActive &&
                        u.Role.RoleName == "Doctor" &&
                        onDutyDoctorIds.Contains(u.Id))
            .OrderBy(u => u.FullName)
            .Select(u => new DoctorListItemDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .ToListAsync();
    }

    public async Task<List<DoctorListItemDto>> GetAllDoctorsAsync()
    {
        return await _context.Users
            .Include(u => u.Role)
            .Where(u => u.IsActive && u.Role.RoleName == "Doctor")
            .OrderBy(u => u.FullName)
            .Select(u => new DoctorListItemDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .ToListAsync();
    }

    public async Task<DoctorAvailableDatesDto?> GetDoctorAvailableDatesAsync(int doctorId, int weeksAhead = 8)
    {
        var doctor = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Id == doctorId && u.Role.RoleName == "Doctor");

        if (doctor == null)
            return null;

        var availableDays = await _context.StaffAvailabilities
            .Where(a => a.UserId == doctorId)
            .Select(a => a.DayOfWeek)
            .Distinct()
            .ToListAsync();

        if (availableDays.Count == 0)
            return new DoctorAvailableDatesDto
            {
                DoctorId = doctorId,
                DoctorName = doctor.FullName,
                AvailableDates = []
            };

        var today = DateTime.UtcNow.Date;
        var dates = new List<string>();

        for (var i = 0; i < weeksAhead * 7; i++)
        {
            var date = today.AddDays(i);
            if (availableDays.Contains(date.DayOfWeek))
                dates.Add(date.ToString("yyyy-MM-dd"));
        }

        return new DoctorAvailableDatesDto
        {
            DoctorId = doctorId,
            DoctorName = doctor.FullName,
            AvailableDates = dates
        };
    }
}
