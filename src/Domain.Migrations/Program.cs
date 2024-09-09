using Aspire.Prototype.Domain;
using Aspire.Prototype.Domain.Migrations;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService<Worker>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(Worker.ActivitySourceName));

builder.AddSqlServerDbContext<ApplicationDbContext>("sqldb", null, options => {
    options.UseSqlServer(options => {
        options.MigrationsAssembly(typeof(Worker).Assembly.FullName);
        options.EnableRetryOnFailure();
        options.CommandTimeout(600);
    });
});

var host = builder.Build();
host.Run();
