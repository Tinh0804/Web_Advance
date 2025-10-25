using src.Domain.Entities;

namespace src.Application.DTOs.ModelDto
{
    public class UserDto
    {
        public string Id { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class RegisterDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public int NativeLanguagueId { get; set; } = 1;
    }

    public class LoginDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

  
    public class ExternalLogin
    {
         public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Provider { get; set; } = string.Empty; // "Google", "Facebook"
        public string ProviderKey { get; set; } = string.Empty; // ID từ provider
        public DateTime CreatedAt { get; set; }
    
    // Navigation property
    public UserProfile UserProfile { get; set; } = null!;
    }
}