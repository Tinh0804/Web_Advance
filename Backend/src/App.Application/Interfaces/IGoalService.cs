using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IGoalService
    {
        Task<GoalDto?> GetUserGoalAsync(int userId);
        Task<GoalDto> CreateGoalAsync(CreateGoalDto dto);
        Task<bool> UpdateGoalProgressAsync(UpdateGoalProgressDto dto);
        Task<bool> ResetDailyGoalsAsync();
        Task<bool> DeleteGoalAsync(int id);
    }
}