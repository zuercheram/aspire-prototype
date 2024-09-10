using Aspire.Prototype.AppHost.CustomHostingModel;

var builder = DistributedApplication.CreateBuilder(args);

var prefix = "apsire-prototype-dev";

// Automatically provision an Application Insights resource
var insights = builder.ExecutionContext.IsPublishMode
    ? builder.AddAzureApplicationInsights($"{prefix}-app-insights")
    : builder.AddConnectionString("appInsights");

var sqldb = builder.AddSqlServer($"{prefix}-sql-server").WithReference(insights).AddDatabase($"{prefix}-sql-database");

var secrets = builder.ExecutionContext.IsPublishMode
    ? builder.AddAzureKeyVault($"{prefix}-secrets")
    : builder.AddConnectionString("secrets");

builder.AddProject<Projects.Aspire_Prototype_Domain_Migrations>($"{prefix}-migrations")
    .WithReference(sqldb)
    .WithReference(insights);

var server = builder.AddProject<Projects.Aspire_Prototype_Server>($"{prefix}-server")
    .WithReference(secrets)
    .WithReference(sqldb)
    .WithReference(insights)
    .WithExternalHttpEndpoints();

builder.AddYarnApp($"{prefix}-react", "../Client", "dev")
    .WithReference(server)
    .WithReference(insights)
    .WithHttpEndpoint(env: "PORT")
    .WithEnvironment("BROWSER", "none")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

var host = builder.Build();
host.Run();
