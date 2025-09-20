using System.ComponentModel.DataAnnotations;

namespace App.Domain.Entities
{
    public class Role
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public bool IsActive { get; set; } = true;
        
        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}