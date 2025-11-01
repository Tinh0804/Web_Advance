// IUnitRepository.cs
using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IUnitRepository : IRepository<Unit>
    {
        Task<IEnumerable<Unit>> GetUnitsByCourseIdAsync(int courseId);
        Task<Unit?> GetUnitWithLessonsAsync(int unitId);
        Task<Unit?> GetNextUnitAsync(int courseId, int currentOrderIndex);
        Task<bool> IsUnitUnlockedForUserAsync(int unitId, int userId);
    }
}