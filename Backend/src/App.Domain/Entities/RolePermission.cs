using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace src.Domain.Entities
{
    public class RolePermission
    {
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public string RoleId { get; set; } 
        public int PermissionId { get; set; }
        public DateTime GrantedAt { get; set; } = DateTime.UtcNow;
        public string GrantedBy { get; set; } = string.Empty;

        // Navigation properties
        public IdentityRole Role { get; set; } = null!;
        public Permission Permission { get; set; } = null!;
    }
}