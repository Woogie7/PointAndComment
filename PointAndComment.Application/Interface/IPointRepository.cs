using PointAndComment.Domain.Entities;

namespace PointAndComment.Application.Service;

public interface IPointRepository
{
    Task<IEnumerable<Point>> GetAllAsync();
    Task<Point?> GetByIdAsync(Guid id);
    Task AddAsync(Point point);
    Task UpdateAsync(Point point);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}