using AutoMapper;
using Microsoft.AspNetCore.Identity;
using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class PermissionService : IPermissionService
    {
        private readonly IPermissionRepository _permissionRepository;
        private readonly UserManager<UserAccount> _userManager;
        private readonly IMapper _mapper;

        public PermissionService(
            IPermissionRepository permissionRepository,
            UserManager<UserAccount> userManager,
            IMapper mapper)
        {
            _permissionRepository = permissionRepository;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<List<PermissionDto>> GetAllPermissionsAsync()
        {
            var permissions = await _permissionRepository.GetAllActivePermissionsAsync();
            return _mapper.Map<List<PermissionDto>>(permissions);
        }

        public async Task<List<PermissionDto>> GetPermissionsByModuleAsync(string module)
        {
            var permissions = await _permissionRepository.GetPermissionsByModuleAsync(module);
            return _mapper.Map<List<PermissionDto>>(permissions);
        }

        public async Task<PermissionDto> CreatePermissionAsync(CreatePermissionDto createPermissionDto)
        {
            var existingPermission = await _permissionRepository.GetByNameAsync(createPermissionDto.Name);
            if (existingPermission != null)
                throw new InvalidOperationException("Permission already exists");

            var permission = new Permission
            {
                Name = createPermissionDto.Name,
                DisplayName = createPermissionDto.DisplayName,
                Description = createPermissionDto.Description,
                Module = createPermissionDto.Module,
                IsActive = true
            };

            var createdPermission = await _permissionRepository.AddAsync(permission);
            return _mapper.Map<PermissionDto>(createdPermission);
        }

        public async Task<bool> UserHasPermissionAsync(string userId, string permission)
        {
            var userPermissions = await GetUserPermissionsAsync(userId);
            return userPermissions.Contains(permission);
        }

        public async Task<List<string>> GetUserPermissionsAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) 
                return new List<string>();

            var userRoles = await _userManager.GetRolesAsync(user);
            return await _permissionRepository.GetUserPermissionNamesAsync(userId, userRoles.ToList());
        }
    }
}