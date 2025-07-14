using PointAndComment.Application.DTO;

namespace PointAndComment.Application.Interface;

public interface IPointService
{
    Task<List<PointDto>> GetAllAsync();
    Task<PointDto> GetByIdAsync(Guid id);
    Task<PointDto> AddAsync(PointDto dto);
    Task DeleteAsync(Guid id);
    Task UpdateColorAsync(Guid pointId, string newColor);

    Task UpdatePositionAsync(Guid pointId, PointPositionDto positionPosition);
    Task AddCommentAsync(Guid pointId, CommentDto dto);
    Task UpdateCommentAsync(Guid commentId, CommentDto dto);
    Task DeleteCommentAsync(Guid commentId);
}