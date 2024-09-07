using System.Diagnostics;
using Aspire.Prototype.Domain.Migrations.Seeder;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using OpenTelemetry.Trace;

namespace Aspire.Prototype.Domain.Migrations;
#pragma warning disable CA1848 // Use the LoggerMessage delegates
public class MigrationService : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private readonly ILogger<MigrationService> _logger;
    private readonly MigrationOptions _migrationOption;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private static readonly ActivitySource s_activitySource = new(ActivitySourceName);

    public MigrationService(IServiceProvider serviceProvider, IHostApplicationLifetime hostApplicationLifetime, ILogger<MigrationService> logger, IOptions<MigrationOptions> migrationOptions)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
        _migrationOption = migrationOptions.Value;
        _hostApplicationLifetime = hostApplicationLifetime;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Migrate

        _logger.LogInformation("Running migrations");

        using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);


        using var scope = _serviceProvider.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        if (_migrationOption.Clear)
        {
            _logger.LogInformation("Deleting database");
            await dbContext.Database.EnsureDeletedAsync(stoppingToken);
        }

        _logger.LogInformation("Migrating database");

        const int maxRetries = 10;
        int retries;
        for (retries = 0; retries < maxRetries; retries++)
        {
            try
            {
                await EnsureDatabaseAsync(dbContext, stoppingToken);
                await RunMigrationAsync(dbContext, stoppingToken);
                await SeedDataAsync(dbContext, _migrationOption, stoppingToken);
                break;
            }
            catch (SqlException ex)
            {
                _logger.LogWarning("Couldn't migrate, retrying...");
                _logger.LogError(ex, "Error: {Error}", ex.Message);
                activity?.RecordException(ex);
                Thread.Sleep(2000);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error: {Error}", ex.Message);
                activity?.RecordException(ex);
                throw;
            }
        }

        if (retries >= maxRetries)
        {
            throw new TimeoutException("Migration failed after several retries");
        }



        _hostApplicationLifetime.StopApplication();
    }

    private static async Task EnsureDatabaseAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        var dbCreator = dbContext.GetService<IRelationalDatabaseCreator>();

        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Create the database if it does not exist.
            // Do this first so there is then a database to start a transaction against.
            if (!await dbCreator.ExistsAsync(cancellationToken))
            {
                await dbCreator.CreateAsync(cancellationToken);
            }
        });
    }

    private static async Task RunMigrationAsync(ApplicationDbContext dbContext, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Run migration in a transaction to avoid partial migration if it fails.
            await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            await dbContext.Database.MigrateAsync(cancellationToken);
            await transaction.CommitAsync(cancellationToken);
        });
    }

    private static async Task SeedDataAsync(ApplicationDbContext dbContext, MigrationOptions migrationOptions, CancellationToken cancellationToken)
    {
        var strategy = dbContext.Database.CreateExecutionStrategy();
        await strategy.ExecuteAsync(async () =>
        {
            // Seed the database
            await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            if (migrationOptions.IsProduction)
            {
                await ProductionSeeding.SeedAsync(dbContext);
            }
            else
            {
                await DeveloperSeeding.SeedAsync(dbContext);
            }
            await transaction.CommitAsync(cancellationToken);
        });
    }

    public override Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
#pragma warning restore CA1848 // Use the LoggerMessage delegates
