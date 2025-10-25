using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IAchievementRepository : IRepository<Achievement>
    {
        Task<IEnumerable<Achievement>> GetByTypeAsync(string achievementType);
        Task<IEnumerable<Achievement>> GetUnlockedByUserAsync(int userId);
        Task<Achievement?> GetByRequiredValueAsync(string type, int value);
    }
}