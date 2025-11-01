using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;
using src.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.API.Extensions;
using src.Application.DTOs.Response;
using src.Domain.Entities;
using src.Application.DTOs;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionService _permissionService;

        public PermissionsController(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }

        [HttpGet]
        [Authorize(Roles = $"{SystemRoles.Admin}")]
        public async Task<IActionResult> GetAllPermissions()
        {
            var permissions = await _permissionService.GetAllPermissionsAsync();
            return Ok(ApiResponse<List<PermissionDto>>.SuccessResponse(permissions));

        }

        [HttpGet("by-module/{module}")]
        [Authorize(Roles = $"{SystemRoles.Admin}")]
        public async Task<IActionResult> GetPermissionsByModule(string module)
        {
            var permissions = await _permissionService.GetPermissionsByModuleAsync(module);
             return Ok(ApiResponse<List<PermissionDto>>.SuccessResponse(permissions));
        }

        [HttpPost]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionDto createPermissionDto)
        {
            try
            {
                var permission = await _permissionService.CreatePermissionAsync(createPermissionDto);
                  return Ok(ApiResponse<PermissionDto>.SuccessResponse(permission));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }
    }
}
