using Microsoft.AspNetCore.Identity;
using src.Application.DTOs;
using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class RoleService : IRoleService
    {
        private readonly UserManager<UserAccount> _userManager; 
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IRoleRepository _roleRepository;

      public RoleService(
        RoleManager<IdentityRole> roleManager,
        UserManager<UserAccount> userManager,
        IRoleRepository roleRepository)  // thêm repository
    {
        _roleManager = roleManager;
        _userManager = userManager;
        _roleRepository = roleRepository;
    }

        public async Task<List<RoleDto>> GetAllRolesAsync()
        {
            var roles = await _roleRepository.GetAllRolesAsync();
            return roles.Select(r => new RoleDto
            {
                Id = r.Id,
                Name = r.Name,
                NormalizedName = r.NormalizedName
            }).ToList();
        }

        public async Task<RoleDto?> GetRoleByIdAsync(string roleId)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            if (role == null) return null;

            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                NormalizedName = role.NormalizedName
            };
        }

        public async Task<RoleDto> CreateRoleAsync(CreateRoleDto createRoleDto)
        {
            var existingRole = await _roleManager.FindByNameAsync(createRoleDto.Name);
            if (existingRole != null)
            {
                throw new Exception($"Role '{createRoleDto.Name}' already exists");
            }

            var role = new IdentityRole
            {
                Name = createRoleDto.Name,
                NormalizedName = createRoleDto.Name.ToUpper()
            };

            var result = await _roleManager.CreateAsync(role);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to create role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                NormalizedName = role.NormalizedName
            };
        }

        public async Task<RoleDto> UpdateRoleAsync(string roleId, UpdateRoleDto updateRoleDto)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }

            // Check if new name already exists
            if (role.Name != updateRoleDto.Name)
            {
                var existingRole = await _roleManager.FindByNameAsync(updateRoleDto.Name);
                if (existingRole != null)
                {
                    throw new Exception($"Role '{updateRoleDto.Name}' already exists");
                }
            }

            role.Name = updateRoleDto.Name;
            role.NormalizedName = updateRoleDto.Name.ToUpper();

            var result = await _roleManager.UpdateAsync(role);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to update role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            return new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                NormalizedName = role.NormalizedName
            };
        }

        public async Task DeleteRoleAsync(string roleId)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }

            // Check if any users have this role
            var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name);
            if (usersInRole.Any())
            {
                throw new Exception($"Cannot delete role. {usersInRole.Count} user(s) are assigned to this role");
            }

            var result = await _roleManager.DeleteAsync(role);
            if (!result.Succeeded)
            {
                throw new Exception($"Failed to delete role: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }

        public async Task<bool> AssignRolesToUserAsync(string userId, List<string> roleIds)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            // Get current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            
            // Remove current roles
            if (currentRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    throw new Exception("Failed to remove existing roles");
                }
            }

            // Get role names from roleIds
            var roleNames = new List<string>();
            foreach (var roleId in roleIds)
            {
                var role = await _roleRepository.GetRoleByIdAsync(roleId);
                if (role != null)
                {
                    roleNames.Add(role.Name);
                }
            }

            if (roleNames.Any())
            {
                var addResult = await _userManager.AddToRolesAsync(user, roleNames);
                if (!addResult.Succeeded)
                {
                    throw new Exception($"Failed to assign roles: {string.Join(", ", addResult.Errors.Select(e => e.Description))}");
                }
            }

            return true;
        }

        public async Task<List<PermissionDto>> GetRolePermissionsAsync(string roleId)
        {
            var permissions = await _roleRepository.GetRolePermissionsAsync(roleId);
            return permissions.Select(p => new PermissionDto
            {
                //  = p.PermissionId,
                Name = p.Name,
                DisplayName = p.DisplayName,
                Description = p.Description,
                Module = p.Module,
                IsActive = p.IsActive
            }).ToList();
        }

        public async Task<bool> AssignPermissionsToRoleAsync(string roleId, List<int> permissionIds)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }

            await _roleRepository.AssignPermissionsToRoleAsync(roleId, permissionIds);
            return true;
        }

        public async Task<bool> RemovePermissionsFromRoleAsync(string roleId, List<int> permissionIds)
        {
            var role = await _roleRepository.GetRoleByIdAsync(roleId);
            if (role == null)
            {
                throw new Exception("Role not found");
            }

            await _roleRepository.RemovePermissionsFromRoleAsync(roleId, permissionIds);
            return true;
        }
    }
}