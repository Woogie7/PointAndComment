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

    public async Task AddAsync(PointDto dto)
    {
        var point = new Point(Guid.NewGuid(), dto.X, dto.Y, dto.Radius, dto.Color);

        foreach (var commentDto in dto.Comments)
        {
            var comment = new Comment(Guid.NewGuid(), commentDto.Text, commentDto.BackgroundColor);
            point.AddComment(comment);
        }

        await _repo.AddAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        await _repo.DeleteAsync(id);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdateColorAsync(Guid pointId, string newColor)
    {
        var point = await _repo.GetByIdAsync(pointId);
        if (point is null) return;

        point.UpdateColor(newColor);
        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdatePositionAsync(Guid pointId, PointPositionDto positionPosition)
    {
        var point = await _repo.GetByIdAsync(pointId);
        if (point is null) return;

        point.UpdatePosition(positionPosition.X, positionPosition.Y);
        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task AddCommentAsync(Guid pointId, CommentDto dto)
    {
        var point = await _repo.GetByIdAsync(pointId);
        if (point == null) return;

        var comment = new Comment(Guid.NewGuid(), dto.Text, dto.BackgroundColor);
        point.AddComment(comment);

        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }

    public async Task UpdateCommentAsync(Guid commentId, CommentDto dto)
    {
        var allPoints = await _repo.GetAllAsync();
        var point = allPoints.FirstOrDefault(p => p.Comments.Any(c => c.Id == commentId));
        if (point == null) return;

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
        var allPoints = await _repo.GetAllAsync();
        var point = allPoints.FirstOrDefault(p => p.Comments.Any(c => c.Id == commentId));
        if (point == null) return;

        var comment = point.Comments.First(c => c.Id == commentId);
        point.RemoveComment(comment);

        await _repo.UpdateAsync(point);
        await _repo.SaveChangesAsync();
    }
}