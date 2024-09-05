using System.ComponentModel.DataAnnotations;

namespace Test.Template.React.App.Domain.Entities;

public class Glass : EntityTrackingBase
{
    public int GlassId { get; set; }

    [MaxLength(255)] public string Name { get; set; } = string.Empty;

    public List<Drink> Drinks { get; set; } = new();
}
