using Data.Model;
using Data.Model.Migrations;
using Microsoft.EntityFrameworkCore;

var builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();
builder.Services.AddHostedService<Worker>();

builder.Services.Configure<MigrationOptions>(builder.Configuration.GetSection("Migration"));

builder.AddNpgsqlDbContext<ApplicationDbContext>("postgresdb", null, options =>
{
    MigrationOptions migrationOptions = new();
    builder.Configuration.GetSection("Migration").Bind(migrationOptions);
    options.UseNpgsql(options =>
    {
        options.MigrationsAssembly(typeof(Worker).Assembly.FullName);
        options.EnableRetryOnFailure();
        options.CommandTimeout(600);
    });
});

var host = builder.Build();
host.Run();
