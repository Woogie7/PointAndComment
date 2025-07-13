namespace PointAndComment.Application.DTO;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string BackgroundColor { get; set; } = "#e74c3c";
}