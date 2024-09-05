using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace Test.Template.React.App.Services.Tests.Helper;

public class XunitLogger : ILogger
{
    private readonly string _categoryName;
    private readonly ITestOutputHelper _testOutputHelper;

    public XunitLogger(ITestOutputHelper testOutputHelper, string categoryName)
    {
        _testOutputHelper = testOutputHelper;
        _categoryName = categoryName;
    }

    public IDisposable BeginScope<TState>(TState state) where TState : notnull
    {
        return NoopDisposable.Instance;
    }

    public bool IsEnabled(LogLevel logLevel)
    {
        return true;
    }

    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
    {
        _testOutputHelper.WriteLine($"{_categoryName} [{eventId}] {formatter(state, exception)}");
        if (exception != null)
        {
            _testOutputHelper.WriteLine(exception.ToString());
        }
    }

    private class NoopDisposable : IDisposable
    {
        public static readonly NoopDisposable Instance = new();

        public void Dispose()
        {
        }
    }
}
