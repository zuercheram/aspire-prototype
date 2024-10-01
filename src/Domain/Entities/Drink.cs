using System.ComponentModel.DataAnnotations;

namespace Aspire.Prototype.Domain.Entities;

public class Drink : EntityTrackingBase
{
    public int DrinkId { get; set; }

    [MaxLength(100)] public string Name { get; set; } = string.Empty;

    public DrinkType Type { get; set; }

    public DrinkCategory Category { get; set; }

    [MaxLength(255)] public string? ImageUrl { get; set; }

    [MaxLength(255)] public string? ThumbUrl { get; set; }

    public List<DrinkIngredient> DrinkIngredients { get; set; } = new();

    public ICollection<Ingredient>? Ingredients { get; set; }

    public int? GlassId { get; set; }
    public Glass? Glass { get; set; }

    [MaxLength(2000)] public string? Instructions { get; set; }

    [MaxLength(255)] public string? Tags { get; set; }
}
