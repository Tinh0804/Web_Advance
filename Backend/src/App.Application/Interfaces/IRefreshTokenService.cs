
using src.Application.DTOs.ModelDto;
using src.Application.DTOs.Response;
using src.Domain.Entities;

namespace src.Application.Interfaces
{
    public interface IRefreshTokenService
    {
       Task<AuthResponse> RefreshTokenAsync(string refreshToken, string? ipAddress = null);
        Task<bool> RevokeTokenAsync(string refreshToken, string? ipAddress = null);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<List<RefreshToken>> GetActiveTokensByUserIdAsync(string userId);
    }
}