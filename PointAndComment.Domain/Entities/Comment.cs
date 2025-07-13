namespace PointAndComment.Domain.Entities;

public class Comment
{
    public Guid Id { get; private set; }
    public string Text { get; private set; }
    public string BackgroundColor { get; private set; }

    public Comment(Guid id, string text, string backgroundColor)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Text = text;
        BackgroundColor = backgroundColor;
    }

    public void UpdateText(string text)
    {
        Text = text;
    }

    public void UpdateBackgroundColor(string color)
    {
        BackgroundColor = color;
    }
}