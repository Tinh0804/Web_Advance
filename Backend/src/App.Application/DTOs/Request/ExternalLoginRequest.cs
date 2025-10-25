namespace src.Application.DTOs.Request
{
    public class ExternalLoginRequest
    {
        public string Provider { get; set; } = string.Empty; // "Google" hoặc "Facebook"
        public string AccessToken { get; set; } = string.Empty; // Token từ frontend
    }
}