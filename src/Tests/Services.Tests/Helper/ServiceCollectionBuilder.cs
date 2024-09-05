using Test.Template.React.App.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace Test.Template.React.App.Services.Tests.Helper;

public static class ServiceCollectionBuilder
{
    public static ServiceCollection BuildServiceCollection(ITestOutputHelper? testOutputHelper = null, bool useLocalDb = false,
        string databaseName = "Test.Template.React.App-Test", bool logMicrosoftTraces = false)
    {
        var serviceCollection = new ServiceCollection();

        serviceCollection.AddOptions();
        serviceCollection.AddLogging(builder =>
        {
            if (testOutputHelper != null)
            {
                builder.AddProvider(new XunitLoggerProvider(testOutputHelper));
            }

            if (!logMicrosoftTraces)
            {
                builder.AddFilter((cat, level) => cat == null || !cat.StartsWith("Microsoft"));
            }
        });

        if (useLocalDb)
        {
            serviceCollection.AddDbContext<ApplicationDbContext>(options => options.UseTestLocalDb(databaseName));
        }
        else
        {
            // alternative InMemoryDb, but does not provide referential integrity checks:
            //  serviceCollection.AddDbContext<ApplicationDbContext>(options => options.UseTestInMemoryDb(databaseName));
            serviceCollection.AddDbContext<ApplicationDbContext>(ctx => ctx.UseTestSqliteInMemoryDb(databaseName));
        }

        return serviceCollection;
    }

    public static ServiceCollection BuildServiceCollection(string connectionString, ITestOutputHelper? testOutputHelper = null, bool logMicrosoftTraces = false)
    {
        var serviceCollection = new ServiceCollection();

        serviceCollection.AddOptions();
        serviceCollection.AddLogging(builder =>
        {
            if (testOutputHelper != null)
            {
                builder.AddProvider(new XunitLoggerProvider(testOutputHelper));
            }

            if (!logMicrosoftTraces)
            {
                builder.AddFilter((cat, level) => cat != null && cat.StartsWith("Microsoft"));
            }
        });

        serviceCollection.AddDbContext<ApplicationDbContext>(ctx => ctx.UseSqlServer(connectionString));
        return serviceCollection;
    }

    public static void InitializeDatabase(this IServiceProvider serviceProvider, bool createNewDatabase = false)
    {
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

#pragma warning disable EF1001 // Internal EF Core API usage. // just for test purpose
        context.GetDependencies().StateManager.ResetState();
#pragma warning restore EF1001 // Internal EF Core API usage.

        if (createNewDatabase)
        {
            context.Database.EnsureDeleted(); // is not supported in in-memory mode
        }

        context.Database.EnsureCreated();
    }
}
