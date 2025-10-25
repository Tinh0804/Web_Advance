using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace src.Domain.Entities
{
    public class UserAccount : IdentityUser
    {

        // Quan hệ 1-1 với Profile
        [Column("isActive")]
        public bool IsActive { get; set; } = true;
        
          [Column("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public UserProfile? Profile { get; set; }

    }
}