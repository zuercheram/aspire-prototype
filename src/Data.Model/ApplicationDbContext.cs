using Data.Model.Entities;
using Microsoft.EntityFrameworkCore;

namespace Data.Model;
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }   

    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Message>().Property(e => e.Id).ValueGeneratedOnAdd();
    }
}
