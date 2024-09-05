using Test.Template.React.App.Domain;
using Test.Template.React.App.Domain.Entities;
using Test.Template.React.App.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Test.Template.React.App.Services;

public class DrinkService : IDrinkService
{
    private readonly ApplicationDbContext _dbContext;
    private readonly ILogger<DrinkService> _logger;

    public DrinkService(ApplicationDbContext dbContext, ILogger<DrinkService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task<IList<DrinkModel>> GetAllDrinksAsync()
    {
        return await _dbContext.Drinks
            .OrderBy(p => p.Name)
            .Select(d => new DrinkModel
            {
                DrinkId = d.DrinkId,
                Name = d.Name,
                Instructions = d.Instructions,
                ImageUrl = d.ImageUrl,
                ThumbUrl = d.ThumbUrl,
                Category = d.Category.ToString(),
                Type = d.Type.ToString()
            })
            .ToListAsync();
    }

    public async Task<DrinkModel> GetDrinkByIdAsync(int id)
    {
        return await _dbContext.Drinks
            .Select(d => new DrinkModel
            {
                DrinkId = d.DrinkId,
                Name = d.Name,
                Instructions = d.Instructions,
                ImageUrl = d.ImageUrl,
                ThumbUrl = d.ThumbUrl,
                Category = d.Category.ToString(),
                Type = d.Type.ToString(),
                Glass = d.Glass!.Name,
                Ingredients = d.DrinkIngredients
                    .OrderBy(p => p.Step)
                    .Select(di => new DrinkIngredientModel { Step = di.Step, Ingredient = di.Ingredient!.Name, Measure = di.Measure })
                    .ToList()
            })
            .SingleAsync(p => p.DrinkId == id);
    }

    public async Task<int> CreateDrinkAsync(DrinkModel drinkModel)
    {
        var drinkEntity = new Drink
        {
            Name = drinkModel.Name,
            Instructions = drinkModel.Instructions,
            ImageUrl = drinkModel.ImageUrl,
            Category = Enum.Parse<DrinkCategory>(drinkModel.Category),
            Type = Enum.Parse<DrinkType>(drinkModel.Type)
            // ....
        };

        _dbContext.Drinks.Add(drinkEntity);
        await _dbContext.SaveChangesAsync();

        drinkModel.DrinkId = drinkEntity.DrinkId;

        _logger.LogInformation("Drink {DrinkId} created.", drinkModel.DrinkId);

        return drinkEntity.DrinkId;
    }

    public async Task UpdateDrinkAsync(DrinkModel drinkModel)
    {
        var drinkEntity = await _dbContext.Drinks.SingleAsync(p => p.DrinkId == drinkModel.DrinkId);

        drinkEntity.Name = drinkModel.Name;
        drinkEntity.Instructions = drinkModel.Instructions;
        drinkEntity.ImageUrl = drinkModel.ImageUrl;
        // ....

        await _dbContext.SaveChangesAsync();

        _logger.LogInformation("Drink {DrinkId} updated", drinkModel.DrinkId);
    }
}
