// src/Infrastructure/Services/JwtTokenGenerator.cs
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;
using TokenValidationResult = src.Domain.Interfaces.TokenValidationResult;

namespace src.Infrastructure.Services
{
    /// <summary>
    /// JWT token generation and validation implementation (Infrastructure Layer)
    /// Handles all JWT-specific logic using Microsoft.IdentityModel.Tokens
    /// </summary>
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly UserManager<UserAccount> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IPermissionService _permissionService;
        private readonly IUserProfileRepository _userProfileRepository;

        public JwtTokenGenerator(
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
            {
                throw new InvalidOperationException("User not found");
            }

            var userProfile = await _userProfileRepository.GetUserProfileByAccountIdAsync(userId);
            if (userProfile == null)
            {
                throw new InvalidOperationException("UserProfile not found");
            }

            var userRoles = await _userManager.GetRolesAsync(user);
            var userPermissions = await _permissionService.GetUserPermissionsAsync(userId);

            var claims = BuildClaims(user, userProfile, userRoles, userPermissions);
            var token = CreateJwtToken(claims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<TokenValidationResult> ValidateJwtTokenAsync(string jwtToken)
        {
            var result = new TokenValidationResult { IsValid = false };

            if (string.IsNullOrWhiteSpace(jwtToken))
            {
                result.ErrorMessage = "Token is empty";
                return result;
            }

            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var validationParameters = GetTokenValidationParameters();

                var principal = tokenHandler.ValidateToken(
                    jwtToken, 
                    validationParameters, 
                    out SecurityToken validatedToken);

                if (!IsValidAlgorithm(validatedToken))
                {
                    result.ErrorMessage = "Invalid token algorithm";
                    return result;
                }

                result.IsValid = true;
                result.ExpiryDate = ((JwtSecurityToken)validatedToken).ValidTo;

                // Synchronous return since no async work needed
                return await Task.FromResult(result);
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

        #region Private Helper Methods

        private List<Claim> BuildClaims(
            UserAccount user, 
            UserProfile userProfile, 
            IList<string> roles, 
            IEnumerable<string> permissions)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Name, userProfile.FullName ?? string.Empty),
                new Claim("NativeLanguage", userProfile.NativeLanguage?.LanguageName ?? string.Empty),
                new Claim("CurrentStreak", userProfile.CurrentStreak.ToString()),
                new Claim("TotalXP", userProfile.TotalExperience.ToString()),
                new Claim("Hearts", userProfile.Hearts.ToString())
            };

            // Add roles
            foreach (var role in roles)
            {
                claims.Add(new Claim("Role", role));
            }

            // Add permissions
            foreach (var permission in permissions)
            {
                claims.Add(new Claim("Permission", permission));
            }

            return claims;
        }

        private JwtSecurityToken CreateJwtToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            return new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );
        }

        private TokenValidationParameters GetTokenValidationParameters()
        {
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]!);

            return new TokenValidationParameters
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
        }

        private static bool IsValidAlgorithm(SecurityToken validatedToken)
        {
            return validatedToken is JwtSecurityToken jwtSecurityToken &&
                   jwtSecurityToken.Header.Alg.Equals(
                       SecurityAlgorithms.HmacSha256, 
                       StringComparison.InvariantCultureIgnoreCase);
        }

        #endregion
    }
}