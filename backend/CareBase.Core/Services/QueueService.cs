using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Core.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CareBase.Core.Hubs;

namespace CareBase.Core.Services;

public class QueueService(AppDbContext context, IHubContext<QueueHub, IQueueHub> hubContext)
{
    private readonly AppDbContext _context = context;
    private readonly IHubContext<QueueHub, IQueueHub> _hubContext = hubContext;

    private static string GenerateQueueNumber()
    {
        return $"Q-{DateTime.UtcNow.Year}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
    }

    private async Task BroadcastQueueUpdate()
    {
        var queue = await GetQueue();
        await _hubContext.Clients.All.ReceiveQueueUpdate(queue);
    }

    public async Task<QueueItem> AddToQueue(AddToQueueDto dto)
    {
        var today = DateTime.UtcNow.Date;
        var tomorrow = today.AddDays(1);

        var alreadyQueuedToday = await _context.Queue.AnyAsync(q =>
            q.PatientRef == dto.PatientRef &&
            q.CheckInTime >= today &&
            q.CheckInTime < tomorrow);

        if (alreadyQueuedToday)
            throw new InvalidOperationException(
                $"Patient {dto.PatientRef} is already in today's queue and cannot be added again.");

        var assignedClinician = await PickClinicianAsync(today, tomorrow);

        var item = new QueueItem
        {
            QueueNumber = GenerateQueueNumber(),
            PatientId = dto.PatientId,
            PatientRef = dto.PatientRef,
            Priority = dto.Priority ?? "Normal",
            Status = "Waiting",
            AssignedTo = assignedClinician,
            CheckInTime = DateTime.UtcNow
        };

        _context.Queue.Add(item);
        await _context.SaveChangesAsync();

        await BroadcastQueueUpdate();

        return item;
    }

    private async Task<string> PickClinicianAsync(DateTime today, DateTime tomorrow)
    {
        var todayDayOfWeek = today.DayOfWeek;

        var activeStaff = await _context.Users
            .Include(u => u.Role)
            .Where(u => u.IsActive &&
                        (u.Role.RoleName == "Doctor" || u.Role.RoleName == "Nurse"))
            .ToListAsync();

        if (activeStaff.Count == 0)
            throw new InvalidOperationException(
                "No active doctors or nurses are in the system. Please add clinical staff before queueing patients.");

        var doctorsOnDutyToday = await _context.StaffAvailabilities
            .Where(a => a.DayOfWeek == todayDayOfWeek)
            .Select(a => a.UserId)
            .Distinct()
            .ToListAsync();

        var availableDoctors = activeStaff
            .Where(u => u.Role.RoleName == "Doctor" && doctorsOnDutyToday.Contains(u.Id))
            .ToList();

        var availableNurses = activeStaff
            .Where(u => u.Role.RoleName == "Nurse")
            .ToList();

        // Doctors only when scheduled today; nurses always cover the clinic
        var assignmentPool = availableDoctors.Concat(availableNurses).ToList();

        if (assignmentPool.Count == 0)
            throw new InvalidOperationException(
                "No nurses or on-duty doctors are available today. Add nurses or schedule a doctor for this day.");

        var activeLoads = await _context.Queue
            .Where(q => q.CheckInTime >= today &&
                        q.CheckInTime < tomorrow &&
                        (q.Status == "Waiting" || q.Status == "InProgress"))
            .GroupBy(q => q.AssignedTo)
            .Select(g => new { AssignedTo = g.Key, Count = g.Count() })
            .ToListAsync();

        var loadByName = activeLoads.ToDictionary(x => x.AssignedTo, x => x.Count);

        var minLoad = assignmentPool.Min(c => loadByName.GetValueOrDefault(c.FullName, 0));
        var leastLoaded = assignmentPool
            .Where(c => loadByName.GetValueOrDefault(c.FullName, 0) == minLoad)
            .ToList();

        var selected = leastLoaded[Random.Shared.Next(leastLoaded.Count)];
        return selected.FullName;
    }

    public async Task<List<QueueItem>> GetQueue()
    {
        return await _context.Queue
            .OrderByDescending(q => q.Priority == "Emergency")
            .ThenByDescending(q => q.Priority == "Priority")
            .ThenBy(q => q.CheckInTime)
            .ToListAsync();
    }

    public async Task<QueueItem?> CallNext()
    {
        var next = await _context.Queue
            .Where(q => q.Status == "Waiting")
            .OrderByDescending(q => q.Priority == "Emergency")
            .ThenByDescending(q => q.Priority == "Priority")
            .ThenBy(q => q.CheckInTime)
            .FirstOrDefaultAsync();

        if (next == null)
            return null;

        next.Status = "InProgress";
        next.CalledTime = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        await BroadcastQueueUpdate();

        return next;
    }

    public async Task CompleteQueue(int queueId)
    {
        var item = await _context.Queue.FindAsync(queueId);

        if (item != null)
        {
            item.Status = "Completed";
            item.CompletedTime = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await BroadcastQueueUpdate();
        }
    }

    public async Task SkipQueue(int queueId)
    {
        var item = await _context.Queue.FindAsync(queueId);

        if (item != null)
        {
            item.Status = "Skipped";
            await _context.SaveChangesAsync();

            await BroadcastQueueUpdate();
        }
    }
}
