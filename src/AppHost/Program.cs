using Aspire.Prototype.AppHost.CustomHostingModel;

var builder = DistributedApplication.CreateBuilder(args);

var sqldb = builder.AddSqlServer("sql").AddDatabase("sqldb");

builder.AddProject<Projects.Aspire_Prototype_Domain_Migrations>("migrations")
    .WithReference(sqldb);

var server = builder.AddProject<Projects.Aspire_Prototype_Server>("server")
    .WithReference(sqldb)
    .WithExternalHttpEndpoints();

builder.AddYarnApp("react", "../Client", "dev")
    .WithReference(server)
    .WithEnvironment("BROWSER", "none")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
