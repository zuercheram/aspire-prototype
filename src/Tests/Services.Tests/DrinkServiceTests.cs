using Test.Template.React.App.Domain.Entities;
using Test.Template.React.App.Services.Tests.Helper;
using Test.Template.React.App.Shared;
using Microsoft.Extensions.DependencyInjection;
using Xunit.Abstractions;

namespace Test.Template.React.App.Services.Tests;

public class DrinkServiceTests
{
    private readonly ITestOutputHelper _testOutputHelper;

    public DrinkServiceTests(ITestOutputHelper testOutputHelper)
    {
        _testOutputHelper = testOutputHelper;
    }

    [Fact]
    [Trait("Category", "IntegrationTest")]
    public async Task DrinkService_CreateAndReadSingleDrink_NewEqualsRead()
    {
        // Setup
        var serviceCollection = ServiceCollectionBuilder.BuildServiceCollection(_testOutputHelper);
        serviceCollection.AddServices();
        var serviceProvider = serviceCollection.BuildServiceProvider();
        serviceProvider.InitializeDatabase();

        var drinkService = serviceProvider.GetRequiredService<IDrinkService>();

        // Action
        var drinkModel = new DrinkModel { Name = "Drink1", Instructions = "drink", Category = DrinkCategory.OrdinaryDrink.ToString(), Type = DrinkType.Alcoholic.ToString() };
        var id = await drinkService.CreateDrinkAsync(drinkModel);
        var drinkModel2 = await drinkService.GetDrinkByIdAsync(id);

        // Assert
        Assert.Equal(drinkModel.Name, drinkModel2.Name);
        Assert.Equal(id, drinkModel2.DrinkId);
    }
}
