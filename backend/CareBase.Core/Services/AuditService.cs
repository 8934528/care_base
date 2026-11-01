using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CareBase.Core.Services;

public class AuditService(AppDbContext context)
{
    private readonly AppDbContext _context = context;

    public async Task LogAsync(
        string action,
        string module,
        string details,
        string? resourceId = null,
        int? userId = null,
        string? userName = null,
        string? userRole = null,
        string result = "Success",
        string ipAddress = "127.0.0.1")
    {
        try
        {
            var log = new AuditLog
            {
                Action = action,
                Module = module,
                Details = details,
                ResourceId = resourceId,
                UserId = userId,
                UserName = userName,
                UserRole = userRole,
                IpAddress = ipAddress,
                Result = result,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
        catch
        {
            // Logging should never block primary operation
        }
    }

    public async Task<(List<AuditLog> Logs, int TotalCount)> GetLogsAsync(
        string? module = null,
        string? action = null,
        string? search = null,
        DateTime? from = null,
        DateTime? to = null,
        int page = 1,
        int pageSize = 20)
    {
        var query = _context.AuditLogs
            .Include(a => a.User)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(module))
            query = query.Where(a => a.Module == module);

        if (!string.IsNullOrWhiteSpace(action))
            query = query.Where(a => a.Action == action);

        if (from.HasValue)
            query = query.Where(a => a.Timestamp >= from.Value);

        if (to.HasValue)
            query = query.Where(a => a.Timestamp <= to.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(a =>
                a.Details.ToLower().Contains(term) ||
                (a.UserName != null && a.UserName.ToLower().Contains(term)) ||
                (a.ResourceId != null && a.ResourceId.ToLower().Contains(term)));
        }

        var total = await query.CountAsync();
        var logs = await query
            .OrderByDescending(a => a.Timestamp)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (logs, total);
    }
}
