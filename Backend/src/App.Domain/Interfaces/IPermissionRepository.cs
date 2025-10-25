using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IPermissionRepository
    {
        Task<List<Permission>> GetAllActivePermissionsAsync();
        Task<List<Permission>> GetPermissionsByModuleAsync(string module);
        Task<Permission?> GetByNameAsync(string name);
        Task<Permission> AddAsync(Permission permission);
        Task<List<string>> GetUserPermissionNamesAsync(string userId, List<string> userRoles);
    }
}