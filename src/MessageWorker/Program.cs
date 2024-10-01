using MessageWorker;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();
builder.AddAzureServiceBusClient("messaging");

var host = builder.Build();
host.Run();
