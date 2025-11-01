using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalsController : ControllerBase
    {
        private readonly IGoalService _goalService;
        private readonly ILogger<GoalsController> _logger;

        public GoalsController(
            IGoalService goalService,
            ILogger<GoalsController> logger)
        {
            _goalService = goalService;
            _logger = logger;
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(ApiResponse<GoalDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetUserGoal(int userId)
        {
            try
            {
                var goal = await _goalService.GetUserGoalAsync(userId);
                if (goal == null)
                {
                    return NotFound(ApiResponse<GoalDto>.ErrorResponse("Goal not found for this user"));
                }

                return Ok(ApiResponse<GoalDto>.SuccessResponse(goal));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving goal for user {UserId}", userId);
                return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse(
                    "An error occurred while retrieving the goal"));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<GoalDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateGoal([FromBody] CreateGoalDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<GoalDto>.ErrorResponse("Invalid data"));
                }

                var goal = await _goalService.CreateGoalAsync(dto);
                return CreatedAtAction(
                    nameof(GetUserGoal),
                    new { userId = goal.UserId },
                    ApiResponse<GoalDto>.SuccessResponse(goal, "Goal created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating goal");
                return StatusCode(500, ApiResponse<GoalDto>.ErrorResponse(
                    "An error occurred while creating the goal"));
            }
        }

        [HttpPatch("progress")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateGoalProgress([FromBody] UpdateGoalProgressDto dto)
        {
            try
            {
                var result = await _goalService.UpdateGoalProgressAsync(dto);
                if (!result)
                {
                    return BadRequest(ApiResponse<bool>.ErrorResponse("Failed to update progress"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Progress updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating goal progress for user {UserId}", dto.UserId);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while updating goal progress"));
            }
        }

        [HttpPost("reset-daily")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ResetDailyGoals()
        {
            try
            {
                await _goalService.ResetDailyGoalsAsync();
                return Ok(ApiResponse<bool>.SuccessResponse(true, "Daily goals reset successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting daily goals");
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while resetting daily goals"));
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            try
            {
                await _goalService.DeleteGoalAsync(id);
                return Ok(ApiResponse<bool>.SuccessResponse(true, "Goal deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting goal {GoalId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while deleting the goal"));
            }
        }
    }
}