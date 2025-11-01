// IUserAchievementRepository.cs
using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IUserAchievementRepository : IRepository<UserAchievement>
    {
        Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(int userId);
        Task<UserAchievement?> GetUserAchievementAsync(int userId, int achievementId);
        Task<bool> HasUserEarnedAchievementAsync(int userId, int achievementId);
        Task<int> GetTotalAchievementsCountAsync(int userId);
    }
}