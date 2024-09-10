using System.Text.Json;
using Aspire.Prototype.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aspire.Prototype.Domain.Migrations.Seeder;

internal static class DeveloperSeeding
{
    public static async Task SeedAsync(ApplicationDbContext dbContext)
    {
        await dbContext.AddDrinks("margarita");
        await dbContext.AddDrinks("gin");
        await dbContext.AddDrinks("old");
        await dbContext.AddDrinks("whiskey");
        await dbContext.AddDrinks("rum");
        await dbContext.AddDrinks("vodka");
    }

    internal static async Task AddDrinks(this ApplicationDbContext dbContext, string searchTerm)
    {
        var httpClient = new HttpClient();
        var drinkStream = await httpClient.GetStreamAsync($"https://www.thecocktaildb.com/api/json/v1/1/search.php?s={searchTerm}");
        var drinkJson = await JsonDocument.ParseAsync(drinkStream);

        var root = drinkJson.RootElement;

        var drinks = root.GetProperty("drinks");

        foreach (var drink in drinks.EnumerateArray())
        {
            var drinkEntity = new Drink
            {
                Name = drink.GetProperty("strDrink").ToString(),
                Tags = drink.GetProperty("strTags").GetString(),
                Category = drink.GetProperty("strCategory").GetString() switch
                {
                    "Ordinary Drink" => DrinkCategory.OrdinaryDrink,
                    _ => DrinkCategory.OtherUnknown
                },
                Type = drink.GetProperty("strAlcoholic").GetString() switch
                {
                    "Alcoholic" => DrinkType.Alcoholic,
                    "Non alcoholic" => DrinkType.NonAlcoholic,
                    _ => DrinkType.Unknown
                },
                Instructions = drink.GetProperty("strInstructions").GetString(),
                ThumbUrl = drink.GetProperty("strDrinkThumb").GetString(),
                ImageUrl = drink.GetProperty("strImageSource").GetString(),
                DrinkIngredients = new List<DrinkIngredient>()
            };

            if (!await dbContext.Drinks.AnyAsync(p => p.Name == drinkEntity.Name))
            {
                // ingredients
                for (var i = 1; i <= 15; i++)
                {
                    var ingredient = drink.GetProperty($"strIngredient{i}").GetString();
                    if (!string.IsNullOrEmpty(ingredient))
                    {
                        var ingredientEntity = await dbContext.Ingredients.FirstOrDefaultAsync(p => p.Name == ingredient);

                        if (ingredientEntity == null)
                        {
                            ingredientEntity = new Ingredient { Name = ingredient };
                            dbContext.Ingredients.Add(ingredientEntity);
                        }

                        var measure = drink.GetProperty($"strMeasure{i}").GetString();

                        if (drinkEntity.DrinkIngredients.Exists(p => p.Ingredient != null && p.Ingredient.Name == ingredientEntity.Name))
                            continue; // do not add same ingredient multiple times

                        drinkEntity.DrinkIngredients.Add(new DrinkIngredient { Drink = drinkEntity, Ingredient = ingredientEntity, Measure = measure ?? "", Step = (short)i });
                    }
                }

                // glass
                var glass = drink.GetProperty("strGlass").GetString();
                var glassEntity = await dbContext.Glass.FirstOrDefaultAsync(p => p.Name == glass);
                if (glassEntity == null && !string.IsNullOrEmpty(glass))
                {
                    glassEntity = new Glass { Name = glass };
                    dbContext.Glass.Add(glassEntity);
                }

                drinkEntity.Glass = glassEntity;

                dbContext.Drinks.Add(drinkEntity);
            }
        }

        await dbContext.SaveChangesAsync();
    }
}
