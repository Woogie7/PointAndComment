using PointAndComment.Domain.Entities;

namespace PointAndComment.Application.Interface;

public interface IPointRepository
{
    Task<IEnumerable<Point>> GetAllAsync();
    Task<Point?> GetByIdAsync(Guid id);
    Task AddAsync(Point point);
    Task AddCommentAsync(Comment comment);
    Task UpdateAsync(Point point);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
    
    Task<Point?> GetByIdWithCommentsAsync(Guid id);
    Task<Point?> GetByCommentIdAsync(Guid commentId);
}