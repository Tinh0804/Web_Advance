using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class RefreshTokenRepository : IRefreshTokenRepository
    {
        private readonly ApplicationDbContext _context;

        public RefreshTokenRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _context.RefreshTokens
                .Include(rt => rt.UserAccounts)
                .FirstOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task<RefreshToken> AddAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Add(refreshToken);
            await _context.SaveChangesAsync();
            return refreshToken;
        }

        public async Task UpdateAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(RefreshToken refreshToken)
        {
            _context.RefreshTokens.Remove(refreshToken);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRangeAsync(IEnumerable<RefreshToken> refreshTokens)
        {
            _context.RefreshTokens.RemoveRange(refreshTokens);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RefreshToken>> GetOldTokensByUserIdAsync(string userId, int daysOld = 30)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
            return await _context.RefreshTokens
                .Where(rt => rt.UserAccountId == userId && 
                            rt.CreatedDate < cutoffDate)
                .ToListAsync();
        }

        public async Task<List<RefreshToken>> GetActiveTokensByUserIdAsync(string userId)
        {
            return await _context.RefreshTokens
                .Where(rt => rt.UserAccountId == userId && 
                            rt.RevokedDate == null && 
                            rt.ExpiryDate > DateTime.UtcNow)
                .ToListAsync();
        }
    }
}