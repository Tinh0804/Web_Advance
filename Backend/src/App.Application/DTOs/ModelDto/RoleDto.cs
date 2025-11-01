using System.ComponentModel.DataAnnotations;

namespace src.Application.DTOs.ModelDto
{
    // RoleDto.cs
    public class RoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? NormalizedName { get; set; }
    }

    // CreateRoleDto.cs
    public class CreateRoleDto
    {
        [Required(ErrorMessage = "Role name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Role name must be between 3 and 50 characters")]
        public string Name { get; set; } = string.Empty;
    }

    // UpdateRoleDto.cs
    public class UpdateRoleDto
    {
        [Required(ErrorMessage = "Role name is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Role name must be between 3 and 50 characters")]
        public string Name { get; set; } = string.Empty;
    }

    // AssignRoleDto.cs
    public class AssignRoleDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public string UserId { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one role must be specified")]
        [MinLength(1, ErrorMessage = "At least one role must be specified")]
        public List<string> RoleIds { get; set; } = new List<string>();
    }

   

    // AssignPermissionsDto.cs
    public class AssignPermissionsDto
    {
        [Required(ErrorMessage = "Role ID is required")]
        public string RoleId { get; set; } = string.Empty;

        [Required(ErrorMessage = "At least one permission must be specified")]
        [MinLength(1, ErrorMessage = "At least one permission must be specified")]
        public List<int> PermissionIds { get; set; } = new List<int>();
    }
}