namespace Data.Model.ViewModels;
public class MessageViewModel
{
    public int Id { get; set; }
    public string Message { get; set; }
    public DateTime Created { get; set; }
    public DateTime Received { get; set; }
}
