using Projects;

var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres").PublishAsAzurePostgresFlexibleServer();
var postgresdb = postgres.AddDatabase("postgresdb");

var serviceBus = builder.ExecutionContext.IsPublishMode
    ? builder.AddAzureServiceBus("messaging")
    : builder.AddConnectionString("messaging");

builder.AddProject<MessageWorker>("messageworker")
    .WithReference(serviceBus);

var weatherApi = builder.AddProject<MinimalApi>("messagesapi")
    .WithReference(postgresdb)
    .WithExternalHttpEndpoints();

builder.AddNpmApp("angular", "../Frontend")
    .WithReference(weatherApi)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddProject<MessageReceiver>("messagereceiver")
    .WithReference(postgresdb)
    .WithReference(serviceBus);

builder.AddProject<Data_Model_Migrations>("data-model-migrations")
    .WithReference(postgresdb);

builder.Build().Run();
