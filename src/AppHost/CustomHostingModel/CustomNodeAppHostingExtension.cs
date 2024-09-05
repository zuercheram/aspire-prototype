using Aspire.Hosting.ApplicationModel;
using Aspire.Hosting.Utils;
using Microsoft.Extensions.Hosting;

namespace Aspire.Prototype.AppHost.CustomHostingModel;
public static class CustomNodeAppHostingExtension
{
    public static IResourceBuilder<NodeAppResource> AddYarnApp(this IDistributedApplicationBuilder builder, string name, string workingDirectory, string scriptName = "dev", string[]? args = null)
    {
        string[] allArgs = args is { Length: > 0 }
            ? [scriptName, "--", .. args]
            : [scriptName];

        workingDirectory = NormalizePathForCurrentPlatform(Path.Combine(builder.AppHostDirectory, workingDirectory));
        var resource = new NodeAppResource(name, "yarn", workingDirectory);

        return builder.AddResource(resource).WithNodeDefaults().WithArgs(allArgs);
    }

    private static IResourceBuilder<NodeAppResource> WithNodeDefaults(this IResourceBuilder<NodeAppResource> builder) =>
        builder.WithOtlpExporter()
            .WithEnvironment("NODE_ENV", builder.ApplicationBuilder.Environment.IsDevelopment() ? "development" : "production");

    public static string NormalizePathForCurrentPlatform(string path)
    {
        if (string.IsNullOrEmpty(path))
        {
            return path;
        }

        // Fix slashes
        path = path.Replace('\\', Path.DirectorySeparatorChar).Replace('/', Path.DirectorySeparatorChar);

        return Path.GetFullPath(path);
    }
}
