// UserAchievementRepository.cs
using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class UserAchievementRepository : IUserAchievementRepository
    {
        private readonly ApplicationDbContext _context;

        public UserAchievementRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserAchievement?> GetByIdAsync(int id)
        {
            return await _context.UserAchievements.FindAsync(id);
        }

        public async Task<IEnumerable<UserAchievement>> GetAllAsync()
        {
            return await _context.UserAchievements.ToListAsync();
        }

        public async Task<UserAchievement> AddAsync(UserAchievement entity)
        {
            await _context.UserAchievements.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(UserAchievement entity)
        {
            _context.UserAchievements.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var achievement = await GetByIdAsync(id);
            if (achievement != null)
            {
                _context.UserAchievements.Remove(achievement);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.UserAchievements.AnyAsync(ua => ua.UserAchievementId == id);
        }

        public async Task<IEnumerable<UserAchievement>> GetUserAchievementsAsync(int userId)
        {
            return await _context.UserAchievements
                .Where(ua => ua.UserId == userId)
                .Include(ua => ua.Achievement)
                .OrderByDescending(ua => ua.DateEarned)
                .ToListAsync();
        }

        public async Task<UserAchievement?> GetUserAchievementAsync(int userId, int achievementId)
        {
            return await _context.UserAchievements
                .Include(ua => ua.Achievement)
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);
        }

        public async Task<bool> HasUserEarnedAchievementAsync(int userId, int achievementId)
        {
            return await _context.UserAchievements
                .AnyAsync(ua => ua.UserId == userId && ua.AchievementId == achievementId);
        }

        public async Task<int> GetTotalAchievementsCountAsync(int userId)
        {
            return await _context.UserAchievements
                .CountAsync(ua => ua.UserId == userId);
        }
    }
}