namespace Data.Model.Entities;

public class Message
{
    public int Id { get; set; }
    public string MessageText { get; set; }
    public DateTime ReceivedAt { get; set; }
    public DateTime CreatedAt { get; set; }

}
