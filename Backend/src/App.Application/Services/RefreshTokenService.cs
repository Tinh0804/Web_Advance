using AutoMapper;
using src.Application.DTOs.ModelDto;
using src.Application.DTOs.Response;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class RefreshTokenService : IRefreshTokenService
    {
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public RefreshTokenService(
            IRefreshTokenRepository refreshTokenRepository,
            ITokenService tokenService,
            IMapper mapper)
        {
            _refreshTokenRepository = refreshTokenRepository;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken, string? ipAddress = null)
        {
            var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

            if (token == null)
                throw new UnauthorizedAccessException("Invalid refresh token");

            if (!token.IsActive)
                throw new UnauthorizedAccessException("Refresh token is no longer active");

            // Revoke old token
            await RevokeRefreshTokenAsync(token, ipAddress, "Replaced by new token");

            // Create new refresh token
            var newRefreshToken = await _tokenService.CreateRefreshTokenAsync(token.UserAccountId);
            await _refreshTokenRepository.AddAsync(newRefreshToken);

            // Update old token with replacement reference
            token.ReplacedByToken = newRefreshToken.Token;
            await _refreshTokenRepository.UpdateAsync(token);

            // Clean up old tokens
            await RemoveOldRefreshTokensAsync(token.UserAccountId);

            // Generate new JWT
            var jwtToken = await _tokenService.GenerateJwtTokenAsync(token.UserAccountId);
            var userDto = _mapper.Map<UserDto>(token.UserAccounts);

            return new AuthResponse
            {
                Token = jwtToken,
                RefreshToken = newRefreshToken.Token,
                User = userDto
            };
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken, string? ipAddress = null)
        {
            var token = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

            if (token == null || !token.IsActive)
                return false;

            await RevokeRefreshTokenAsync(token, ipAddress, "Revoked by user");

            return true;
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _refreshTokenRepository.GetByTokenAsync(token);
        }

        public async Task<List<RefreshToken>> GetActiveTokensByUserIdAsync(string userId)
        {
            return await _refreshTokenRepository.GetActiveTokensByUserIdAsync(userId);
        }

        private async Task RevokeRefreshTokenAsync(RefreshToken token, string? ipAddress = null, string? reason = null)
        {
            token.RevokedDate = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;

            await _refreshTokenRepository.UpdateAsync(token);
        }

        private async Task RemoveOldRefreshTokensAsync(string userId)
        {
            var oldTokens = await _refreshTokenRepository.GetOldTokensByUserIdAsync(userId, 30);

            if (oldTokens.Any())
            {
                await _refreshTokenRepository.DeleteRangeAsync(oldTokens);
            }
        }
    }
}
