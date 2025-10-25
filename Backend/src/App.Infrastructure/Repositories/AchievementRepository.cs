using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class AchievementRepository : BaseRepository<Achievement>, IAchievementRepository
    {

        public AchievementRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Achievement>> GetByTypeAsync(string achievementType)
        {
            return await _dbSet
                .Where(a => a.AchievementType == achievementType)
                .OrderBy(a => a.RequiredValue)
                .ToListAsync();
        }

        public async Task<IEnumerable<Achievement>> GetUnlockedByUserAsync(int userId)
        {
            return await _dbSet
                .Include(a => a.UserAchievements)
                .Where(a => a.UserAchievements!.Any(ua => ua.UserId == userId))
                .ToListAsync();
        }

        public async Task<Achievement?> GetByRequiredValueAsync(string type, int value)
        {
            return await _dbSet
                .FirstOrDefaultAsync(a => a.AchievementType == type && a.RequiredValue == value);
        }
    }
}