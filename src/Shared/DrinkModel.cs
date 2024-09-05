using System.Collections.Generic;

namespace Aspire.Prototype.Shared;

public class DrinkModel
{
    public int? DrinkId { get; set; }
    public string Name { get; set; } = string.Empty;

    public string? Instructions { get; set; }
    public string? ImageUrl { get; set; }
    public string? ThumbUrl { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string? Glass { get; set; }

    public IList<DrinkIngredientModel>? Ingredients { get; set; }
}
