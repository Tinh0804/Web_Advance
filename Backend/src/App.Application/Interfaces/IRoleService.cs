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
        Task<List<string>> GetUserRolesAsync(string userId);
        Task<List<string>> GetUserPermissionsAsync(string userId);
    }
}