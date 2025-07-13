namespace PointAndComment.Application.DTO;

public class PointDto
{
    public Guid Id { get; set; }
    public float X { get; set; }
    public float Y { get; set; }
    public float Radius { get; set; }
    public string Color { get; set; } = "#e74c3c";

    public List<CommentDto> Comments { get; set; } = new();
}