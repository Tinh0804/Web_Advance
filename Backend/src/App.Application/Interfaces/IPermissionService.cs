using src.Application.DTOs.ModelDto;

namespace src.Application.Interfaces
{
    public interface IPermissionService
    {
        Task<List<PermissionDto>> GetAllPermissionsAsync();
        Task<List<PermissionDto>> GetPermissionsByModuleAsync(string module);
        Task<PermissionDto> CreatePermissionAsync(CreatePermissionDto createPermissionDto);
        Task<bool> UserHasPermissionAsync(string userId, string permission);
        Task<List<string>> GetUserPermissionsAsync(string userId);
    }
}