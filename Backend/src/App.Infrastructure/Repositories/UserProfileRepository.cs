using Microsoft.EntityFrameworkCore;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly DbSet<UserProfile> _dbSet;

        public UserProfileRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = _context.Set<UserProfile>();
        }

        public async Task<UserProfile?> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public async Task<IEnumerable<UserProfile>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<UserProfile> AddAsync(UserProfile entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(UserProfile entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<UserProfile?> GetUserProfileByAccountIdAsync(string accountId)
        {
         
                return await _context.UserProfiles
                        .Where(u => u.UserAccountId == accountId)
                        .FirstOrDefaultAsync();
        }

        public Task<bool> ExistsAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}