namespace Test.Template.React.App.Domain.Entities;

public class DrinkIngredient
{
    public int DrinkId { get; set; }
    public Drink? Drink { get; set; }

    public int IngredientId { get; set; }
    public Ingredient? Ingredient { get; set; }

    public short Step { get; set; }
    public string Measure { get; set; } = string.Empty;
}
