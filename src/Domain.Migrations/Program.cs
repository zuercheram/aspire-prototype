using Aspire.Prototype.Domain;
using Aspire.Prototype.Domain.Migrations;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<MigrationService>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(MigrationService.ActivitySourceName));

builder.AddSqlServerDbContext<ApplicationDbContext>("sqldb");

var host = builder.Build();
host.Run();
