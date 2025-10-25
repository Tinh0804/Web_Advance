using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IJwtTokenGenerator
    {
        Task<string> GenerateJwtTokenAsync(string userId);
        Task<TokenValidationResult> ValidateJwtTokenAsync(string jwtToken);
    }
    public class TokenValidationResult
    {
        public bool IsValid { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime? ExpiryDate { get; set; }
    }
}