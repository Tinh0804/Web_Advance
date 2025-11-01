using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleRepository(ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _context = context;
            _roleManager = roleManager;
        }

        public async Task<List<IdentityRole>> GetAllRolesAsync()
        {
            return await _roleManager.Roles.ToListAsync();
        }

        public async Task<IdentityRole?> GetRoleByIdAsync(string roleId)
        {
            return await _roleManager.FindByIdAsync(roleId);
        }

        public async Task<IdentityRole?> GetRoleByNameAsync(string roleName)
        {
            return await _roleManager.FindByNameAsync(roleName);
        }

        public async Task<List<Permission>> GetRolePermissionsAsync(string roleId)
        {
            return await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .Include(rp => rp.Permission)
                .Select(rp => rp.Permission)
                .Where(p => p.IsActive)
                .ToListAsync();
        }

        public async Task AssignPermissionsToRoleAsync(string roleId, List<int> permissionIds)
        {
            // Get existing permissions
            var existingPermissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId)
                .ToListAsync();

            // Find new permissions to add
            var existingPermissionIds = existingPermissions.Select(rp => rp.PermissionId).ToList();
            var newPermissionIds = permissionIds.Except(existingPermissionIds).ToList();

            // Add new permissions
            foreach (var permissionId in newPermissionIds)
            {
                var permission = await _context.Permissions.FindAsync(permissionId);
                if (permission != null && permission.IsActive)
                {
                    var rolePermission = new RolePermission
                    {
                        RoleId = roleId,
                        PermissionId = permissionId,
                        GrantedAt = DateTime.UtcNow,
                        GrantedBy = "System" // You can pass this as parameter if needed
                    };
                    _context.RolePermissions.Add(rolePermission);
                }
            }

            await _context.SaveChangesAsync();
        }

        public async Task RemovePermissionsFromRoleAsync(string roleId, List<int> permissionIds)
        {
            var rolePermissions = await _context.RolePermissions
                .Where(rp => rp.RoleId == roleId && permissionIds.Contains(rp.PermissionId))
                .ToListAsync();

            _context.RolePermissions.RemoveRange(rolePermissions);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> RoleHasPermissionAsync(string roleId, int permissionId)
        {
            return await _context.RolePermissions
                .AnyAsync(rp => rp.RoleId == roleId && rp.PermissionId == permissionId);
        }
    }
}