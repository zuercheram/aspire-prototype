using Aspire.Prototype.Shared;

namespace Aspire.Prototype.Services;

public interface IDrinkService
{
    Task<IList<DrinkModel>> GetAllDrinksAsync();
    Task<DrinkModel> GetDrinkByIdAsync(int id);
    Task<int> CreateDrinkAsync(DrinkModel drinkModel);
    Task UpdateDrinkAsync(DrinkModel drinkModel);
}
