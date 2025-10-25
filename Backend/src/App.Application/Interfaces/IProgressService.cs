using src.Application.DTOs.ModelDto;

namespace src.Application.Interfaces
{
    public interface IProgressService
    {
        Task<UserProfileDto> GetUserProfileAsync(string userId);
        Task UpdateStreakAsync(string userId);
        Task<bool> CanTakeLesson(string userId, int lessonId);
        Task<List<AchievementDto>> CheckAchievementsAsync(string userId);
        Task RefillHeartsAsync(string userId);
        Task<int> GetUserHeartsAsync(string userId);
    }
}