namespace src.Application.DTOs.ModelDto
{
    public class RoleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public List<PermissionDto> Permissions { get; set; } = new();
    }

    public class CreateRoleDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<int> PermissionIds { get; set; } = new();
    }

    public class UpdateRoleDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<int> PermissionIds { get; set; } = new();
    }

    public class AssignRoleDto
    {
        public string UserId { get; set; } = string.Empty;
        public List<string> RoleIds { get; set; } = new();
    }
}