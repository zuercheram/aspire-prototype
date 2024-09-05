using Test.Template.React.App.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Test.Template.React.App.Domain;

internal static class ModelBuilderExtensions
{
    internal static void IsTrackingEntity<T>(this EntityTypeBuilder<T> typeBuilder) where T : EntityTrackingBase
    {
        typeBuilder.Property(p => p.Updated)
            .IsConcurrencyToken();
    }
}
