using Test.Template.React.App.Services;

// ReSharper disable once CheckNamespace
namespace Microsoft.Extensions.DependencyInjection;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddServices(this IServiceCollection serviceCollection)
    {
        serviceCollection.AddScoped<IDrinkService, DrinkService>();
        serviceCollection.AddScoped<MsGraphService>();

        return serviceCollection;
    }
}
