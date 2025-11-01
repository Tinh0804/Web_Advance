using Microsoft.AspNetCore.Identity;
using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IRoleRepository
    {
        Task<List<IdentityRole>> GetAllRolesAsync();
        Task<IdentityRole?> GetRoleByIdAsync(string roleId);
        Task<IdentityRole?> GetRoleByNameAsync(string roleName);
        Task<List<Permission>> GetRolePermissionsAsync(string roleId);
        Task AssignPermissionsToRoleAsync(string roleId, List<int> permissionIds);
        Task RemovePermissionsFromRoleAsync(string roleId, List<int> permissionIds);
        Task<bool> RoleHasPermissionAsync(string roleId, int permissionId);
    }
}