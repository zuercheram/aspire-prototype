using Aspire.Prototype.Domain;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Aspire.Prototype.Services.Tests.Helper;

public static class DbContextFactory
{
    public static ApplicationDbContext CreateApplicationDbContextSqliteInMemory(bool logSql = false)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
        builder.UseTestSqliteInMemoryDb();

        if (logSql)
        {
            builder.LogTo(Console.WriteLine);
        }

        var applicationDbContext = new ApplicationDbContext(builder.Options);
        applicationDbContext.Database.EnsureDeleted();
        applicationDbContext.Database.EnsureCreated();

        return applicationDbContext;
    }

    public static ApplicationDbContext CreateApplicationDbContextInMemory(string databaseName = "Aspire.Prototype-Test", bool createNewDatabase = true)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
        builder.UseTestInMemoryDb(databaseName);

        var applicationDbContext = new ApplicationDbContext(builder.Options);
        if (createNewDatabase)
        {
            applicationDbContext.Database.EnsureDeleted();
        }

        applicationDbContext.Database.EnsureCreated();

        return applicationDbContext;
    }

    public static ApplicationDbContext CreateApplicationDbContextLocalDb(string databaseName = "Aspire.Prototype-Test", bool createNewDatabase = true)
    {
        var builder = new DbContextOptionsBuilder<ApplicationDbContext>();
        builder.UseTestLocalDb(databaseName);

        var applicationDbContext = new ApplicationDbContext(builder.Options);
        if (createNewDatabase)
        {
            applicationDbContext.Database.EnsureDeleted();
        }

        applicationDbContext.Database.EnsureCreated();

        return applicationDbContext;
    }

    public static void UseTestSqliteInMemoryDb(this DbContextOptionsBuilder builder, string databaseName = "Aspire.Prototype-Test")
    {
        var keepAliveConnection = new SqliteConnection($"DataSource={databaseName};mode=memory;cache=shared");
        keepAliveConnection.Open();
        builder.UseSqlite(keepAliveConnection);
    }

    public static void UseTestInMemoryDb(this DbContextOptionsBuilder builder, string databaseName = "Aspire.Prototype-Test")
    {
        builder.UseInMemoryDatabase(databaseName);
    }

    public static void UseTestLocalDb(this DbContextOptionsBuilder builder, string databaseName = "Aspire.Prototype-Test")
    {
        builder
            .UseSqlServer(
                $"Data Source=(LocalDB)\\MSSQLLocalDB;Initial Catalog={databaseName};Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False",
                options => { });
    }
}
