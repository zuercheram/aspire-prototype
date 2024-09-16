using System.Text.Json;
using Azure.Messaging.ServiceBus;
using Data.Model;
using Data.Model.Entities;
using Data.Model.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace MessageReceiver;

public class Worker : BackgroundService
{
    private readonly ILogger<Worker> _logger;
    private readonly ServiceBusClient _client;
    private readonly IServiceProvider _serviceProvider;    

    public Worker(IServiceProvider serviceProvider, ILogger<Worker> logger, ServiceBusClient serviceBusClient)
    {
        _logger = logger;
        _client = serviceBusClient;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var processor = _client.CreateProcessor("testqueuz", new ServiceBusProcessorOptions());

        try
        {
            if (_logger.IsEnabled(LogLevel.Information))
            {
                _logger.LogInformation("Starting the message receiver");
            }
            processor.ProcessMessageAsync += MessageHandler;
            processor.ProcessErrorAsync += ErrorHandler;

            await processor.StartProcessingAsync(stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken);
            }

            await processor.StopProcessingAsync(stoppingToken);
        }
        finally
        {
            await processor.DisposeAsync();
            await _client.DisposeAsync();
        }
    }

    async Task MessageHandler(ProcessMessageEventArgs args)
    {
        Console.WriteLine("Handle Message");
        string body = args.Message.Body.ToString();
        Console.WriteLine($"Received: {body}");

        var recievedBody = JsonSerializer.Deserialize<MessageBody>(body);

        if (recievedBody == null)
        {
            Console.WriteLine("Failed to deserialize message body");
            await args.CompleteMessageAsync(args.Message);
            return;
        }

        try
        {
            using var scope = _serviceProvider.CreateScope();
            using var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await dbContext.Messages.AddAsync(new Message
            {
                MessageText = recievedBody.MessageText,
                CreatedAt = recievedBody.CreatedAt,
                ReceivedAt = DateTime.UtcNow
            });

            await dbContext.SaveChangesAsync();
            Console.Write("Received Message saved to the database");

        }
        catch (Exception ex)
        {
            Console.Write("Could not add received message to database:");
            Console.WriteLine(ex.ToString());
        }
        finally
        {
            await args.CompleteMessageAsync(args.Message);
        }        
    }

    Task ErrorHandler(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception.ToString());
        return Task.CompletedTask;
    }
}
