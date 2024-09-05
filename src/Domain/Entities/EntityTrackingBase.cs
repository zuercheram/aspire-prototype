namespace Aspire.Prototype.Domain.Entities;

public abstract class EntityTrackingBase
{
    public DateTime Created { get; set; }
    public Guid CreatedByOid { get; set; }
    public DateTime Updated { get; set; }
    public Guid UpdatedByOid { get; set; }
}
