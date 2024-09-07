using Aspire.Prototype.AppHost.CustomHostingModel;

var builder = DistributedApplication.CreateBuilder(args);

// Automatically provision an Application Insights resource
var insights = builder.ExecutionContext.IsPublishMode
    ? builder.AddAzureApplicationInsights("AspirePrototypeInsights")
    : builder.AddConnectionString("appInsights");

var sqldb = builder.AddSqlServer("sql").WithReference(insights).AddDatabase("sqldb");

var secrets = builder.ExecutionContext.IsPublishMode
    ? builder.AddAzureKeyVault("secrets")
    : builder.AddConnectionString("secrets");

builder.AddProject<Projects.Aspire_Prototype_Domain_Migrations>("migrations")
    .WithReference(sqldb)
    .WithReference(insights);

var server = builder.AddProject<Projects.Aspire_Prototype_Server>("server")
    .WithReference(secrets)
    .WithReference(sqldb)
    .WithReference(insights)
    .WithExternalHttpEndpoints();

builder.AddYarnApp("react", "../Client", "dev")
    .WithReference(server)
    .WithReference(insights)
    .WithEnvironment("BROWSER", "none")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
