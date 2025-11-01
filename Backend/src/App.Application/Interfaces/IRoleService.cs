using src.Application.DTOs;
using src.Application.DTOs.ModelDto;

namespace src.Application.Interfaces
{
    public interface IRoleService
    {
        Task<List<RoleDto>> GetAllRolesAsync();
        Task<RoleDto?> GetRoleByIdAsync(string roleId);
        Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto);
        Task<RoleDto> UpdateRoleAsync(string roleId, UpdateRoleDto updateRoleDto);
        Task DeleteRoleAsync(string roleId);
        Task<bool> AssignRolesToUserAsync(string userId, List<string> roleIds);
        Task<List<PermissionDto>> GetRolePermissionsAsync(string roleId);
        Task<bool> AssignPermissionsToRoleAsync(string roleId, List<int> permissionIds);
        Task<bool> RemovePermissionsFromRoleAsync(string roleId, List<int> permissionIds);
    }
}