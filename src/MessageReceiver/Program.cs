using Data.Model;
using MessageReceiver;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();
builder.AddAzureServiceBusClient("messaging");
builder.AddNpgsqlDbContext<ApplicationDbContext>("postgresdb");

var host = builder.Build();
host.Run();
