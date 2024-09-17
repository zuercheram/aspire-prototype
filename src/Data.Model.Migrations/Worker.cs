using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;
using OpenTelemetry.Trace;

namespace Data.Model.Migrations;

public class Worker : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private readonly MigrationOptions _migrationOption;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHostApplicationLifetime _hostApplicationLifetime;
    private static readonly ActivitySource s_activitySource = new(ActivitySourceName);
    private readonly ILogger<Worker> _logger;

    public Worker(IServiceProvider serviceProvider, IHostApplicationLifetime hostApplicationLifetime, IOptions<MigrationOptions> migrationOptions, ILogger<Worker> logger)
    {
        _serviceProvider = serviceProvider;
        _migrationOption = migrationOptions.Value;
        _hostApplicationLifetime = hostApplicationLifetime;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Migrate

        _logger.LogInformation("Running migrations");

        using var activity = s_activitySource.StartActivity("Migrating database", ActivityKind.Client);

        using var scope = _serviceProvider.CreateScope();
        using var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
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
#pragma warning disable S2139 // Exceptions should be either logged or rethrown but not both
            try
            {
                await EnsureDatabaseAsync(dbContext, stoppingToken);
                await RunMigrationAsync(dbContext, stoppingToken);
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
#pragma warning restore S2139 // Exceptions should be either logged or rethrown but not both
        }

        if (retries >= maxRetries)
        {
            throw new TimeoutException("Migration failed after several retries");
        }

        Environment.Exit(0);
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
}
