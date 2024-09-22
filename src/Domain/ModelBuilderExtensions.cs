using Aspire.Prototype.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Aspire.Prototype.Domain;

internal static class ModelBuilderExtensions
{
    internal static void IsTrackingEntity<T>(this EntityTypeBuilder<T> typeBuilder) where T : EntityTrackingBase
    {
        typeBuilder.Property(p => p.Updated)
            .IsConcurrencyToken();
    }
}
