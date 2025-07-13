using Microsoft.EntityFrameworkCore;
using PointAndComment.Application.Service;
using PointAndComment.Domain.Entities;

namespace PointAndComment.Infrastructure;

public class PointRepository : IPointRepository
{
    private readonly PointsAndCommentsDbContext _context;

    public PointRepository(PointsAndCommentsDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Point>> GetAllAsync() =>
        await _context.Points.Include(p => p.Comments).ToListAsync();

    public async Task<Point?> GetByIdAsync(Guid id) =>
        await _context.Points.Include(p => p.Comments)
            .FirstOrDefaultAsync(p => p.Id == id);

    public async Task AddAsync(Point point) =>
        await _context.Points.AddAsync(point);

    public async Task DeleteAsync(Guid id)
    {
        var point = await GetByIdAsync(id);
        if (point != null)
            _context.Points.Remove(point);
    }

    public Task UpdateAsync(Point point)
    {
        _context.Points.Update(point);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}