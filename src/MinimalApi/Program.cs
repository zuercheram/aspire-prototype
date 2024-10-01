using Data.Model;
using Data.Model.ViewModels;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.AddNpgsqlDbContext<ApplicationDbContext>("postgresdb");

var app = builder.Build();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(static builder =>
    builder.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin());

app.MapGet("/receivedmessages", async (ApplicationDbContext db) => await db.Messages.Select(x => new MessageViewModel
{
    Id = x.Id,
    Message = x.MessageText,
    Created = x.CreatedAt,
    Received = x.ReceivedAt
}).ToListAsync())
.WithOpenApi();

app.Run();
