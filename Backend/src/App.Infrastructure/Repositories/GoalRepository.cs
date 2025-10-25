using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class GoalRepository : BaseRepository<Goal>, IGoalRepository
    {
        public GoalRepository(ApplicationDbContext context) : base(context) { }

        public async Task<Goal?> GetByUserIdAsync(int userId)
        {
            return await _dbSet
                .Include(g => g.UserProfile)
                .FirstOrDefaultAsync(g => g.UserId == userId);
        }

        public async Task<bool> UpdateProgressAsync(int userId, int progress)
        {
            var goal = await GetByUserIdAsync(userId);
            if (goal == null) return false;

            goal.CurrentValue += progress;
            _dbSet.Update(goal);
            return true;
        }

        public async Task<IEnumerable<Goal>> GetGoalsNeedingResetAsync()
        {
            var now = DateTime.UtcNow;
            return await _dbSet
                .Where(g => g.ResetDate.HasValue && g.ResetDate.Value <= now)
                .ToListAsync();
        }

        public async Task ResetGoalAsync(int goalId)
        {
            var goal = await GetByIdAsync(goalId);
            if (goal != null)
            {
                goal.CurrentValue = 0;
                goal.ResetDate = DateTime.UtcNow.AddDays(1);
                _dbSet.Update(goal);
            }
        }
    }
}