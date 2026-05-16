using System.Security.Claims;
using CareBase.Core.Data;
using CareBase.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CareBase.API.Middleware;

public class AuditLoggingMiddleware(RequestDelegate next)
{
    private readonly RequestDelegate _next = next;

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        try
        {
            await _next(context);

            // Only log if the request was successful and it's a mutating request
            if (context.Request.Method != "GET" && context.Response.StatusCode < 400)
            {
                var userIdString = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? userId = int.TryParse(userIdString, out int id) ? id : null;

                if (userId.HasValue)
                {
                    var auditLog = new AuditLog
                    {
                        UserId = userId.Value,
                        Action = $"{context.Request.Method} {context.Request.Path}",
                        Module = context.Request.Path.Value?.Split('/').Skip(2).FirstOrDefault() ?? "System",
                        Details = $"Request to {context.Request.Path}",
                        Timestamp = DateTime.UtcNow,
                        IpAddress = context.Connection.RemoteIpAddress?.ToString() ?? "Unknown"
                    };

                    dbContext.AuditLogs.Add(auditLog);
                    await dbContext.SaveChangesAsync();
                }
            }
        }
        catch (Exception)
        {
            throw;
        }
    }
}
