using System.Text.Json;
using Azure.Core.Amqp;
using Azure.Messaging.ServiceBus;
using Data.Model.ViewModels;

namespace MessageWorker;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly ServiceBusClient _client;

    public Worker(ILogger<Worker> logger, ServiceBusClient serviceBusClient)
    {
        _logger = logger;
        _client = serviceBusClient;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var sender = _client.CreateSender("testqueuz");
        using ServiceBusMessageBatch messageBatch = await sender.CreateMessageBatchAsync(stoppingToken);

        try
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                if (_logger.IsEnabled(LogLevel.Information))
                {
                    _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                }

                var messageBody = new MessageBody
                {
                    MessageText = $"Message send to Azure service bus at {DateTimeOffset.Now}",
                    CreatedAt = DateTime.UtcNow
                };

                // try adding a message to the batch
                if (!messageBatch.TryAddMessage(new ServiceBusMessage(JsonSerializer.Serialize(messageBody))))
                {
                    // if it is too large for the batch
                    throw new Exception("The message is too large to fit in the batch.");
                }

                await sender.SendMessagesAsync(messageBatch, stoppingToken);

                await Task.Delay(1000*60, stoppingToken);
            }
        }
        finally
        {
            await sender.DisposeAsync();
            await _client.DisposeAsync();
        }
    }
}
