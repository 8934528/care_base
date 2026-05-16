using Microsoft.AspNetCore.SignalR;
using CareBase.Core.Hubs;

namespace CareBase.API.Hubs;

public class QueueHub : Hub<IQueueHub>
{
}
