namespace src.Application.DTOs.ModelDto
{
    public class ExternalUserInfoDto
    {
        public string Email { get; set; } = string.Empty;
        public string? FullName { get; set; }
        public string? Avatar { get; set; }
        public string Provider { get; set; } = string.Empty;
        public string ProviderKey { get; set; } = string.Empty;
    }
}