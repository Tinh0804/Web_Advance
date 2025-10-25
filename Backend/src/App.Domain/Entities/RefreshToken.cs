using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    public class RefreshToken
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Column(TypeName = "nvarchar(500)")]
        [MaxLength(500)]
        public string Token { get; set; } = string.Empty;
        public string UserAccountId { get; set; } = string.Empty;
        public DateTime ExpiryDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? CreatedByIp { get; set; }
        public DateTime? RevokedDate { get; set; }
        public string? RevokedByIp { get; set; }
        public string? ReplacedByToken { get; set; }
        public string? ReasonRevoked { get; set; }

        // Navigation property
        public UserAccount UserAccounts { get; set; } = null!;

        // Helper properties
        public bool IsExpired => DateTime.UtcNow >= ExpiryDate;
        public bool IsRevoked => RevokedDate != null;
        public bool IsActive => !IsRevoked && !IsExpired;
    }
}