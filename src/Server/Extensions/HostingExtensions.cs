using Aspire.Prototype.Domain;
using Aspire.Prototype.Server.Extensions;
using NetEscapades.AspNetCore.SecurityHeaders.Infrastructure;
using Serilog;

namespace Aspire.Prototype.Server.Extensions;

internal static class HostingExtensions
{
    private static IWebHostEnvironment? _env;

    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        var configuration = builder.Configuration;
        _env = builder.Environment;

        builder.AddSqlServerDbContext<ApplicationDbContext>("sqldb");

        builder.Services.AddInfrastructure()
            .AddSecurity(configuration)
            .AddStorage(configuration)
            .AddSwagger(configuration)
            .AddTransient<ICustomHeaderService, SwaggerCspRelaxingHeaderService>()
            .AddServices();

        if (_env!.IsDevelopment())
        {
            builder.Services.AddReverseProxy()
                .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
        }
        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        // Add if you require debugging in dev

        #pragma warning disable S125 // Sections of code should not be commented out
        // IdentityModelEventSource.ShowPII = true;

        app.UseSerilogRequestLogging();

        app.UseSecurityHeaders(
            SecurityHeadersDefinitions.GetHeaderPolicyCollection(_env!.IsDevelopment(),
                app.Configuration["AzureAd:Instance"]));


        if (_env!.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();

            app.UseSwagger();
            app.UseSwaggerUI(options =>
            {
                options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                options.DisplayRequestDuration();
            });
        }
        else
        {
            app.UseExceptionHandler("/Error");
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseNoUnauthorizedRedirect("/api");

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapRazorPages();
        app.MapControllers();

        app.MapNotFound("/api/{**segment}");

        // SPA-specific routing
        if (_env!.IsDevelopment())
        {
            var spaDevServer = app.Configuration.GetValue<string>("SpaDevServerUrl");
            if (!string.IsNullOrEmpty(spaDevServer))
            {
                // proxy any non API requests that we think should go to the vite dev server
                app.MapReverseProxy();
            }
        }

        // handle URLs that we think belong to the SPA routing
        app.MapFallbackToPage("/_Host");

        return app;
    }
}
