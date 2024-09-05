using Aspire.Prototype.Domain.Migrations.Seeder;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Aspire.Prototype.Domain.Migrations;

public class MigrationService : IHostedService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<MigrationService> _logger;
    private readonly MigrationOptions _migrationOption;

    public MigrationService(ApplicationDbContext dbContext, ILogger<MigrationService> logger, IOptions<MigrationOptions> migrationOptions)
    {
        _dbContext = dbContext;
        _logger = logger;
        _migrationOption = migrationOptions.Value;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        // Migrate
        _logger.LogInformation("Running migrations");

        var database = _dbContext.Database;
        if (_migrationOption.Clear)
        {
            _logger.LogInformation("Deleting database");
            await database.EnsureDeletedAsync(cancellationToken);
        }

        _logger.LogInformation("Migrating database");

        const int maxRetries = 10;
        int retries;
        for (retries = 0; retries < maxRetries; retries++)
        {
            try
            {
                await database.MigrateAsync(cancellationToken);
                break;
            }
            catch (SqlException ex)
            {
                _logger.LogWarning("Couldn't migrate, retrying...");
                _logger.LogError(ex, "Error: {Error}", ex.Message);
                Thread.Sleep(2000);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error: {Error}", ex.Message);
            }
        }

        if (retries >= maxRetries)
        {
            throw new TimeoutException("Migration failed after several retries");
        }

        // Seed
        if (_migrationOption.IsProduction)
        {
            await ProductionSeeding.SeedAsync(_dbContext);
        }
        else
        {
            await DeveloperSeeding.SeedAsync(_dbContext);
        }

        Environment.Exit(0);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}
