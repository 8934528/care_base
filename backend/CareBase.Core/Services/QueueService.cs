using CareBase.Core.Entities;
using CareBase.Shared.DTOs;
using CareBase.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using CareBase.Core.Hubs;

namespace CareBase.Core.Services;

public class QueueService
{
    private readonly AppDbContext _context;
    private readonly IHubContext<dynamic> _hubContext; // We still use dynamic or a specific way to call the hub from Core

    
    public QueueService(AppDbContext context, IHubContext<dynamic> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    private string GenerateQueueNumber()
    {
        return $"Q-{DateTime.Now.Year}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";
    }

    private async Task BroadcastQueueUpdate()
    {
        var queue = await GetQueue();
        await _hubContext.Clients.All.SendAsync("ReceiveQueueUpdate", queue);
    }

    public async Task<QueueItem> AddToQueue(AddToQueueDto dto)
    {
        var item = new QueueItem
        {
            QueueNumber = GenerateQueueNumber(),
            PatientId = dto.PatientId,
            PatientRef = dto.PatientRef,
            Priority = dto.Priority ?? "Normal",
            Status = "Waiting"
        };

        _context.Queue.Add(item);
        await _context.SaveChangesAsync();

        await BroadcastQueueUpdate();

        return item;
    }

    public async Task<List<QueueItem>> GetQueue()
    {
        return await _context.Queue
            .OrderByDescending(q => q.Priority == "Emergency")
            .ThenByDescending(q => q.Priority == "Priority")
            .ThenBy(q => q.CheckInTime)
            .ToListAsync();
    }

    public async Task<QueueItem> CallNext(string roleName)
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
        next.CalledTime = DateTime.Now;
        next.AssignedTo = roleName;

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
            item.CompletedTime = DateTime.Now;

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
