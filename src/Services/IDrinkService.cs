using Test.Template.React.App.Shared;

namespace Test.Template.React.App.Services;

public interface IDrinkService
{
    Task<IList<DrinkModel>> GetAllDrinksAsync();
    Task<DrinkModel> GetDrinkByIdAsync(int id);
    Task<int> CreateDrinkAsync(DrinkModel drinkModel);
    Task UpdateDrinkAsync(DrinkModel drinkModel);
}
