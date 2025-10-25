using src.Application.DTOs.ModelDto;
using src.Application.Interfaces;
using src.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.API.Extensions;
using src.Application.DTOs.Response;

namespace src.API.Controllers
{
    [ServiceFilter(typeof(TransactionFilter))]
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roleService;

        public RolesController(IRoleService roleService)
        {
            _roleService = roleService;
        }

        [HttpGet]
        [Authorize(Roles = $"{SystemRoles.Admin},{SystemRoles.Admin}")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleService.GetAllRolesAsync();
            return Ok(ApiResponse<List<RoleDto>>.SuccessResponse(roles));
        }

        [HttpGet("{roleId}")]
        [Authorize(Roles = $"{SystemRoles.Admin},{SystemRoles.Admin}")]
        public async Task<IActionResult> GetRole(string roleId)
        {
            var role = await _roleService.GetRoleByIdAsync(roleId);
            if (role == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Not found role!"));

            return  Ok(ApiResponse<RoleDto>.SuccessResponse(role));
        }

        [HttpPost]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> CreateRole([FromBody] CreateRoleDto createRoleDto)
        {
            try
            {
                var role = await _roleService.CreateRoleAsync(createRoleDto);
                return CreatedAtAction(nameof(GetRole), new { roleId = role.Id }, role);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{roleId}")]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> UpdateRole(string roleId, [FromBody] UpdateRoleDto updateRoleDto)
        {
            try
            {
                var role = await _roleService.UpdateRoleAsync(roleId, updateRoleDto);
                return Ok(role);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{roleId}")]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> DeleteRole(string roleId)
        {
            try
            {
                await _roleService.DeleteRoleAsync(roleId);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("assign")]
        [Authorize(Roles = $"{SystemRoles.Admin}")]
        public async Task<IActionResult> AssignRoles([FromBody] AssignRoleDto assignRoleDto)
        {
            var success = await _roleService.AssignRolesToUserAsync(assignRoleDto.UserId, assignRoleDto.RoleIds);
            if (!success)
                return BadRequest(new { message = "Failed to assign roles" });

            return Ok(new { message = "Roles assigned successfully" });
        }
    }
}