namespace PointAndComment.Domain.Entities;

public class Comment
{
    public Guid Id { get; private set; }
    public string Text { get; private set; }
    public string BackgroundColor { get; private set; }
    public Guid PointId { get; private set; }
    public virtual Point Point { get; private set; } = null!;
    private Comment() { }
    public Comment(string text, string backgroundColor)
    {
        Text = text;
        BackgroundColor = backgroundColor;
    }
    public void SetPoint(Point point)
    {
        Point = point;
        PointId = point.Id;
    }
    public void UpdateText(string text) => Text = text;
    public void UpdateBackgroundColor(string color) => BackgroundColor = color;
}