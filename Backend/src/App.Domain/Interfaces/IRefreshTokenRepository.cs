using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IRefreshTokenRepository
    {
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<RefreshToken> AddAsync(RefreshToken refreshToken);
        Task UpdateAsync(RefreshToken refreshToken);
        Task DeleteAsync(RefreshToken refreshToken);
        Task DeleteRangeAsync(IEnumerable<RefreshToken> refreshTokens);
        Task<List<RefreshToken>> GetOldTokensByUserIdAsync(string userId, int daysOld = 30);
        Task<List<RefreshToken>> GetActiveTokensByUserIdAsync(string userId);
    }
}