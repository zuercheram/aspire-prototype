using Azure.Identity;
using Aspire.Prototype.Server.Extensions;
using Serilog;

#pragma warning disable CA1305
#pragma warning disable CA1852 // Seal internal types
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();
#pragma warning restore CA1852 // Seal internal types
#pragma warning restore CA1305

try
{
    Log.Information("Starting web host");

    var builder = WebApplication.CreateBuilder(args);
    builder.AddServiceDefaults();

    builder.WebHost
        .ConfigureKestrel(serverOptions => { serverOptions.AddServerHeader = false; });        

    builder.Host.UseSerilog((context, loggerConfiguration) =>
        loggerConfiguration.ReadFrom.Configuration(context.Configuration));

    var app = builder
        .ConfigureServices()
        .ConfigurePipeline();
    app.MapDefaultEndpoints();

    app.Run();
}
catch (Exception ex) when (ex.GetType().Name is not "StopTheHostException"
    && ex.GetType().Name is not "HostAbortedException")
{
    Log.Fatal(ex, "Unhandled exception");
}
finally
{
    Log.Information("Shut down complete");
    Log.CloseAndFlush();
}
