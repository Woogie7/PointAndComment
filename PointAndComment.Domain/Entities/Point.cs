namespace PointAndComment.Domain.Entities;

public class Point
{
    public Guid Id { get; private set; }
    public float X { get; private set; }
    public float Y { get; private set; }
    public float Radius { get; private set; }
    public string Color { get; private set; }

    private readonly List<Comment> _comments = new();
    public IReadOnlyList<Comment> Comments => _comments.AsReadOnly();

    public Point(Guid id, float x, float y, float radius, string color)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        X = x;
        Y = y;
        Radius = radius;
        Color = color;
    }

    public void UpdatePosition(float x, float y)
    {
        X = x;
        Y = y;
    }

    public void UpdateRadius(float radius)
    {
        Radius = radius;
    }

    public void UpdateColor(string color)
    {
        Color = color;
    }

    public void AddComment(Comment comment)
    {
        _comments.Add(comment);
        UpdateRadius(30 + _comments.Count * 10);
    }

    public void RemoveComment(Comment comment)
    {
        _comments.Remove(comment);
        UpdateRadius(30 + _comments.Count * 10);
    }
}