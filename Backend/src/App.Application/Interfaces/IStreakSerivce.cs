namespace src.Application.Interfaces
{
    public interface IStreakService
    {
        Task<int> UpdateStreakAsync(string userId, int xpEarned);
        Task<bool> IsDailyGoalMetAsync(string userId);
        Task<int> GetCurrentStreakAsync(string userId);
        Task<Dictionary<DateTime, int>> GetWeeklyProgressAsync(string userId);
    }
}