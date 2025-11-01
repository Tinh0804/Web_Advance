// IUserAchievementService.cs
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IUserAchievementService
    {
        Task<IEnumerable<UserAchievementDto>> GetUserAchievementsAsync(int userId);
        Task<UserAchievementDto?> GetUserAchievementByIdAsync(int id);
        Task<UserAchievementDto> AwardAchievementAsync(CreateUserAchievementDto dto);
        Task<bool> DeleteUserAchievementAsync(int id);
        Task<UserAchievementSummaryDto> GetUserAchievementSummaryAsync(int userId);
        Task<bool> CheckAndAwardAchievementsAsync(int userId);
    }
}