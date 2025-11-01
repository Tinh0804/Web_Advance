using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using src.Application.DTOs;
using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class TokenService : ITokenService
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IPermissionService _permissionService;
        private readonly IUserProfileRepository _userProfileRepository;

        public TokenService(
            UserManager<UserAccount> userManager,
            IConfiguration configuration,
            IPermissionService permissionService,
            IUserProfileRepository userProfileRepository)
        {
            _userManager = userManager;
            _configuration = configuration;
            _permissionService = permissionService;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<string> GenerateJwtTokenAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) 
                throw new InvalidOperationException("User not found");

            var userRoles = await _userManager.GetRolesAsync(user);
            var userPermissions = await _permissionService.GetUserPermissionsAsync(userId);

            
            var userProfile = await _userProfileRepository.GetUserProfileByAccountIdAsync(userId);
            if (userProfile == null) 
                throw new InvalidOperationException("UserProfile not found");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, userProfile.FullName ?? string.Empty),
                new Claim("NativeLanguage", userProfile.NativeLanguage?.LanguageName ?? string.Empty),
                new Claim("CurrentStreak", userProfile.CurrentStreak.ToString()),
                new Claim("TotalXP", userProfile.TotalExperience.ToString()),
                new Claim("Hearts", userProfile.Hearts.ToString())
            };

            // Add roles to claims
            foreach (var role in userRoles)
            {
                claims.Add(new Claim("Role", role));
            }

            // Add permissions to claims
            foreach (var permission in userPermissions)
            {
                claims.Add(new Claim("Permission", permission));
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Secret"] 
                    ?? throw new InvalidOperationException("JWT Secret not configured")));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<RefreshToken> CreateRefreshTokenAsync(string userId)
        {
            var refreshToken = new RefreshToken
            {
                Token = GenerateRefreshToken(),
                UserAccountId = userId,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                CreatedDate = DateTime.UtcNow
            };

            return refreshToken;
        }

        public async Task<bool> ValidateRefreshTokenAsync(string refreshToken)
        {
            if (string.IsNullOrWhiteSpace(refreshToken))
                return false;

            // Note: Actual validation should be done by RefreshTokenManagementService
            // This method just checks format
            return !string.IsNullOrWhiteSpace(refreshToken);
        }

        public async Task<TokenValidationResultDto> ValidateJwtTokenAsync(string jwtToken)
        {
            var result = new TokenValidationResultDto { IsValid = false };

            if (string.IsNullOrWhiteSpace(jwtToken))
            {
                result.ErrorMessage = "Token is empty";
                return result;
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["JWT:ValidIssuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["JWT:ValidAudience"],
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                var principal = tokenHandler.ValidateToken(jwtToken, validationParameters, out SecurityToken validatedToken);

                if (validatedToken is not JwtSecurityToken jwtSecurityToken ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    result.ErrorMessage = "Invalid token algorithm";
                    return result;
                }

                result.IsValid = true;
                result.ExpiryDate = jwtSecurityToken.ValidTo;

                return result;
            }
            catch (SecurityTokenExpiredException)
            {
                result.ErrorMessage = "Token has expired";
                return result;
            }
            catch (SecurityTokenInvalidSignatureException)
            {
                result.ErrorMessage = "Invalid token signature";
                return result;
            }
            catch (SecurityTokenException ex)
            {
                result.ErrorMessage = $"Token validation failed: {ex.Message}";
                return result;
            }
            catch (Exception ex)
            {
                result.ErrorMessage = $"Unexpected error: {ex.Message}";
                return result;
            }
        }

        public async Task<bool> IntrospectTokenAsync(string token)
        {
            // This is a simple check - actual introspection should query the repository
            return !string.IsNullOrWhiteSpace(token);
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}