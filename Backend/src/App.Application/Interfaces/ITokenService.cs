using src.Application.DTOs.ModelDto;
using src.Domain.Entities;

namespace src.Application.Interfaces
{
    public interface ITokenService
    {
        Task<string> GenerateJwtTokenAsync(string userId);
        Task<RefreshToken> CreateRefreshTokenAsync(string userId);
        Task<bool> ValidateRefreshTokenAsync(string refreshToken);
        Task<TokenValidationResultDto> ValidateJwtTokenAsync(string jwtToken);
        Task<bool> IntrospectTokenAsync(string token);
    }
}