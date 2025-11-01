using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementsController : ControllerBase
    {
        private readonly IAchievementService _achievementService;
        private readonly ILogger<AchievementsController> _logger;

        public AchievementsController(
            IAchievementService achievementService,
            ILogger<AchievementsController> logger)
        {
            _achievementService = achievementService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AchievementDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllAchievements()
        {
            try
            {
                var achievements = await _achievementService.GetAllAchievementsAsync();
                return Ok(ApiResponse<IEnumerable<AchievementDto>>.SuccessResponse(
                    achievements, "Achievements retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving achievements");
                return StatusCode(500, ApiResponse<IEnumerable<AchievementDto>>.ErrorResponse(
                    "An error occurred while retrieving achievements"));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<AchievementDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAchievementById(int id)
        {
            try
            {
                var achievement = await _achievementService.GetAchievementByIdAsync(id);
                if (achievement == null)
                {
                    return NotFound(ApiResponse<AchievementDto>.ErrorResponse("Achievement not found"));
                }

                return Ok(ApiResponse<AchievementDto>.SuccessResponse(achievement));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving achievement {AchievementId}", id);
                return StatusCode(500, ApiResponse<AchievementDto>.ErrorResponse(
                    "An error occurred while retrieving the achievement"));
            }
        }

        [HttpGet("type/{type}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AchievementDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAchievementsByType(string type)
        {
            try
            {
                var achievements = await _achievementService.GetAchievementsByTypeAsync(type);
                return Ok(ApiResponse<IEnumerable<AchievementDto>>.SuccessResponse(achievements));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving achievements by type {Type}", type);
                return StatusCode(500, ApiResponse<IEnumerable<AchievementDto>>.ErrorResponse(
                    "An error occurred while retrieving achievements"));
            }
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<AchievementDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserAchievements(int userId)
        {
            try
            {
                var achievements = await _achievementService.GetUserAchievementsAsync(userId);
                return Ok(ApiResponse<IEnumerable<AchievementDto>>.SuccessResponse(achievements));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving achievements for user {UserId}", userId);
                return StatusCode(500, ApiResponse<IEnumerable<AchievementDto>>.ErrorResponse(
                    "An error occurred while retrieving user achievements"));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<AchievementDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateAchievement([FromBody] CreateAchievementDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<AchievementDto>.ErrorResponse("Invalid data"));
                }

                var achievement = await _achievementService.CreateAchievementAsync(dto);
                return CreatedAtAction(
                    nameof(GetAchievementById),
                    new { id = achievement.AchievementId },
                    ApiResponse<AchievementDto>.SuccessResponse(achievement, "Achievement created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating achievement");
                return StatusCode(500, ApiResponse<AchievementDto>.ErrorResponse(
                    "An error occurred while creating the achievement"));
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteAchievement(int id)
        {
            try
            {
                var result = await _achievementService.DeleteAchievementAsync(id);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResponse("Achievement not found"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Achievement deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting achievement {AchievementId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while deleting the achievement"));
            }
        }
    }
}