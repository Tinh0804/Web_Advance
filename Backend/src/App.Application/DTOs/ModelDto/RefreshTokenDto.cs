
namespace src.Application.DTOs.ModelDto
{
    public class RefreshTokenRequestDto
    {
        public string RefreshToken { get; set; } = string.Empty;
    }

    public class RevokeTokenRequestDto
    {
        public string? RefreshToken { get; set; }
    }
     public class ValidateTokenRequestDto
    {
        public string Token { get; set; } = string.Empty;
    }

    public class TokenValidationResultDto
    {
        public bool IsValid { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string? ErrorMessage { get; set; }
    }
}