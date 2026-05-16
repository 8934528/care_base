namespace CareBase.Core.Hubs;

public interface IQueueHub
{
    Task ReceiveQueueUpdate(object queueData);
}
