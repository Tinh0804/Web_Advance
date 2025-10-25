namespace src.Application.DTOs.ModelDto
{
    public class GoogleTokenInfo
    {
        public string Sub { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Picture { get; set; } = string.Empty;
        public string Aud { get; set; } = string.Empty; // Audience (Client ID)
        public long Exp { get; set; } // Expiration time
    }
}