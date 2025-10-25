using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Domain.Interfaces
{
    public interface IGoalRepository : IRepository<Goal>
    {
        Task<Goal?> GetByUserIdAsync(int userId);
        Task<bool> UpdateProgressAsync(int userId, int progress);
        Task<IEnumerable<Goal>> GetGoalsNeedingResetAsync();
        Task ResetGoalAsync(int goalId);
    }
}