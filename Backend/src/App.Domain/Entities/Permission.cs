using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using src.Domain.Entities; // Add this if RolePermission is in the same namespace, otherwise use the correct namespace

namespace src.Domain.Entities
{
    public class Permission
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public  int PermissionId { get; set; } 
        public string Name { get; set; } = string.Empty; // e.g., "lessons.create"
        public string DisplayName { get; set; } = string.Empty; // e.g., "Create Lessons"
        public string Description { get; set; } = string.Empty;
        public string Module { get; set; } = string.Empty; // e.g., "Learning", "Admin"
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
    }
}