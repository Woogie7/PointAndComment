using PointAndComment.Application.DTO;
using PointAndComment.Application.Interface;
using PointAndComment.Domain.Entities;

namespace PointAndComment.Application.Service;

public class PointService : IPointService
{
    private readonly IPointRepository _repo;

    public PointService(IPointRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<PointDto>> GetAllAsync()
    {
        var points = await _repo.GetAllAsync();

        return points.Select(p => new PointDto
        {
            Id = p.Id,
            X = p.X,
            Y = p.Y,
            Radius = p.Radius,
            Color = p.Color,
            Comments = p.Comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                BackgroundColor = c.BackgroundColor
            }).ToList()
        }).ToList();
    }

    public async Task<PointDto> GetByIdAsync(Guid id)
    {
        var point = await _repo.GetByIdAsync(id);

        return new PointDto
        {
            Id = point.Id,
            X = point.X,
            Y = point.Y,
            Radius = point.Radius,
            Color = point.Color,
            Comments = point.Comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                BackgroundColor = c.BackgroundColor
            }).ToList()
        };
    }

    public async Task<PointDto> AddAsync(PointDto dto)
    {
        var point = new Point(dto.X, dto.Y, dto.Radius, dto.Color);

        await _repo.AddAsync(point);
        await _repo.SaveChangesAsync();

        return point.ToDto();
    }

    public async Task DeleteAsync(Guid id)
    {
        await _repo.DeleteAsync(id);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdateColorAsync(Guid pointId, string newColor)
    {
        var point = await _repo.GetByIdAsync(pointId);
        point?.UpdateColor(newColor);
        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdatePositionAsync(Guid pointId, PointPositionDto position)
    {
        var point = await _repo.GetByIdAsync(pointId);
        point?.UpdatePosition(position.X, position.Y);
        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task AddCommentAsync(Guid pointId, CommentDto dto)
    {
        var point = await _repo.GetByIdWithCommentsAsync(pointId);
        if (point == null) throw new Exception("Point not found");

        point.AddComment(dto.Text, dto.BackgroundColor);

        await _repo.SaveChangesAsync();
    }


    public async Task UpdateCommentAsync(Guid commentId, CommentDto dto)
    {
        var point = await _repo.GetByCommentIdAsync(commentId);
        if (point == null) throw new Exception("Comment not found");

        var comment = point.Comments.First(c => c.Id == commentId);

        if (!string.IsNullOrWhiteSpace(dto.Text))
        {
            comment.UpdateText(dto.Text);
        }

        if (!string.IsNullOrWhiteSpace(dto.BackgroundColor))
        {
            comment.UpdateBackgroundColor(dto.BackgroundColor);
        }

        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task DeleteCommentAsync(Guid commentId)
    {
        var point = await _repo.GetByCommentIdAsync(commentId)
                    ?? throw new KeyNotFoundException("Comment not found");
        
        var comment = point.Comments.First(c => c.Id == commentId);
        
        point.RemoveComment(comment);
        
        await _repo.SaveChangesAsync();
    }
}
public static class PointMapper
{
    public static PointDto ToDto(this Point point)
    {
        return new PointDto
        {
            Id = point.Id,
            X = point.X,
            Y = point.Y,
            Radius = point.Radius,
            Color = point.Color,
            Comments = point.Comments.Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                BackgroundColor = c.BackgroundColor
            }).ToList()
        };
    }
}