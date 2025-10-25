using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IAchievementService
    {
        Task<IEnumerable<AchievementDto>> GetAllAchievementsAsync();
        Task<AchievementDto?> GetAchievementByIdAsync(int id);
        Task<IEnumerable<AchievementDto>> GetAchievementsByTypeAsync(string type);
        Task<IEnumerable<AchievementDto>> GetUserAchievementsAsync(int userId);
        Task<AchievementDto> CreateAchievementAsync(CreateAchievementDto dto);
        Task<bool> CheckAndUnlockAchievementsAsync(int userId, string type, int value);
        Task<bool> DeleteAchievementAsync(int id);
    }
}