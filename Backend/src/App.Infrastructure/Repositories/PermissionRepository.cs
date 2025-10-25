using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class PermissionRepository : IPermissionRepository
    {
        private readonly ApplicationDbContext _context;

        public PermissionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Permission>> GetAllActivePermissionsAsync()
        {
            return await _context.Permissions
                .Where(p => p.IsActive)
                .OrderBy(p => p.Module)
                .ThenBy(p => p.DisplayName)
                .ToListAsync();
        }

        public async Task<List<Permission>> GetPermissionsByModuleAsync(string module)
        {
            return await _context.Permissions
                .Where(p => p.Module == module && p.IsActive)
                .OrderBy(p => p.DisplayName)
                .ToListAsync();
        }

        public async Task<Permission?> GetByNameAsync(string name)
        {
            return await _context.Permissions
                .FirstOrDefaultAsync(p => p.Name == name);
        }

        public async Task<Permission> AddAsync(Permission permission)
        {
            _context.Permissions.Add(permission);
            await _context.SaveChangesAsync();
            return permission;
        }

        public async Task<List<string>> GetUserPermissionNamesAsync(string userId, List<string> userRoles)
        {
            return await _context.RolePermissions
                .Include(rp => rp.Role)
                .Include(rp => rp.Permission)
                .Where(rp => userRoles.Contains(rp.Role.Name!) && rp.Permission.IsActive)
                .Select(rp => rp.Permission.Name)
                .Distinct()
                .ToListAsync();
        }
    }
}