using Aspire.Prototype.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aspire.Prototype.Domain;

public class ApplicationDbContext : DbContext
{
#pragma warning disable CS8618 // DbSet Properties are initialized on creation
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {        
        // Make sure DetectChanges is called explicitly before UpdateTrackingEntityProperties() to be able to query for EntityState
        // Unfortunately this leads to concurrency issues on update due to the fact that tracking property value changes are not detected
    }
#pragma warning restore CS8618
    public DbSet<Drink> Drinks { get; set; }

    public DbSet<Ingredient> Ingredients { get; set; }

    public DbSet<DrinkIngredient> DrinkIngredients { get; set; }

    public DbSet<Glass> Glass { get; set; }

    /// <inheritdoc />
    public override int SaveChanges()
    {
        UpdateTrackingEntityProperties();
        return base.SaveChanges();
    }

    /// <inheritdoc />
    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTrackingEntityProperties();
        return base.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    ///     Saves changes without updating tracking entities
    /// </summary>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public Task<int> SystemSaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTrackingEntityProperties()
    {
        var currentUserOid = UserContextHelper.GetCurrentOid();
        var now = DateTime.UtcNow;

        var addedEntities = ChangeTracker
            .Entries()
            .Where(e => e.State == EntityState.Added && e.Entity is EntityTrackingBase)
            .Select(p => (EntityTrackingBase)p.Entity);

        foreach (var entityTrackingBase in addedEntities)
        {
            entityTrackingBase.Created = now;
            entityTrackingBase.CreatedByOid = currentUserOid;

            entityTrackingBase.Updated = entityTrackingBase.Created;
            entityTrackingBase.UpdatedByOid = entityTrackingBase.CreatedByOid;
        }

        var modifiedEntities = ChangeTracker
            .Entries()
            .Where(e => e.State == EntityState.Modified && e.Entity is EntityTrackingBase)
            .Select(p => (EntityTrackingBase)p.Entity);

        foreach (var entityTrackingBase in modifiedEntities)
        {
            entityTrackingBase.Updated = now;
            entityTrackingBase.UpdatedByOid = currentUserOid;
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Drink>()
            .IsTrackingEntity();

        // Many to Many Relationship using Entity
        modelBuilder.Entity<Drink>()
            .HasMany(p => p.Ingredients)
            .WithMany(p => p.Drinks)
            .UsingEntity<DrinkIngredient>(builder =>
            {
                builder.HasOne(p => p.Drink)
                    .WithMany(p => p.DrinkIngredients)
                    .HasForeignKey(p => p.DrinkId);

                builder.HasOne(p => p.Ingredient)
                    .WithMany(p => p.DrinkIngredients)
                    .HasForeignKey(p => p.IngredientId);

                builder.HasKey(p => new { p.IngredientId, p.DrinkId });
            });

        modelBuilder.Entity<Ingredient>()
            .IsTrackingEntity();

        modelBuilder.Entity<Glass>()
            .IsTrackingEntity();
    }
}
