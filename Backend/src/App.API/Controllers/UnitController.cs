using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UnitsController : ControllerBase
    {
        private readonly IUnitService _unitService;

        public UnitsController(IUnitService unitService)
        {
            _unitService = unitService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUnits()
        {
            var units = await _unitService.GetAllUnitsAsync();
            return Ok(ApiResponse<IEnumerable<UnitDto>>.SuccessResponse(units));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUnitById(int id)
        {
            var unit = await _unitService.GetUnitByIdAsync(id);
            if (unit == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Unit not found"));

            return Ok(ApiResponse<UnitDetailDto>.SuccessResponse(unit));
        }

        [HttpGet("course/{courseId}")]
        public async Task<IActionResult> GetUnitsByCourseId(int courseId)
        {
            var units = await _unitService.GetUnitsByCourseIdAsync(courseId);
            return Ok(ApiResponse<IEnumerable<UnitDto>>.SuccessResponse(units));
        }

        [HttpPost]
        public async Task<IActionResult> CreateUnit([FromBody] CreateUnitDto dto)
        {
            try
            {
                var unit = await _unitService.CreateUnitAsync(dto);
                return CreatedAtAction(nameof(GetUnitById), new { id = unit.UnitId },
                    ApiResponse<UnitDto>.SuccessResponse(unit));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUnit(int id, [FromBody] UpdateUnitDto dto)
        {
            var success = await _unitService.UpdateUnitAsync(id, dto);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("Unit not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Unit updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            var success = await _unitService.DeleteUnitAsync(id);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("Unit not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Unit deleted successfully"));
        }

        [HttpGet("{unitId}/unlock-status/{userId}")]
        public async Task<IActionResult> CheckUnlockStatus(int unitId, int userId)
        {
            var isUnlocked = await _unitService.UnlockUnitForUserAsync(unitId, userId);
            return Ok(ApiResponse<bool>.SuccessResponse(isUnlocked));
        }

        [HttpGet("course/{courseId}/next/{currentOrderIndex}")]
        public async Task<IActionResult> GetNextUnit(int courseId, int currentOrderIndex)
        {
            var nextUnit = await _unitService.GetNextUnitAsync(courseId, currentOrderIndex);
            if (nextUnit == null)
                return NotFound(ApiResponse<string>.ErrorResponse("No next unit found"));

            return Ok(ApiResponse<UnitDto>.SuccessResponse(nextUnit));
        }
    }
}
