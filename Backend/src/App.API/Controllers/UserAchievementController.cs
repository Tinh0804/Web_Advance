using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserAchievementsController : ControllerBase
    {
        private readonly IUserAchievementService _userAchievementService;

        public UserAchievementsController(IUserAchievementService userAchievementService)
        {
            _userAchievementService = userAchievementService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserAchievements(int userId)
        {
            var achievements = await _userAchievementService.GetUserAchievementsAsync(userId);
            return Ok(ApiResponse<IEnumerable<UserAchievementDto>>.SuccessResponse(achievements));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserAchievementById(int id)
        {
            var achievement = await _userAchievementService.GetUserAchievementByIdAsync(id);
            if (achievement == null)
                return NotFound(ApiResponse<string>.ErrorResponse("User achievement not found"));

            return Ok(ApiResponse<UserAchievementDto>.SuccessResponse(achievement));
        }

        [HttpPost]
        public async Task<IActionResult> AwardAchievement([FromBody] CreateUserAchievementDto dto)
        {
            try
            {
                var achievement = await _userAchievementService.AwardAchievementAsync(dto);
                return CreatedAtAction(nameof(GetUserAchievementById), 
                    new { id = achievement.UserAchievementId }, 
                    ApiResponse<UserAchievementDto>.SuccessResponse(achievement));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserAchievement(int id)
        {
            var success = await _userAchievementService.DeleteUserAchievementAsync(id);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("User achievement not found"));

            return Ok(ApiResponse<string>.SuccessResponse("User achievement deleted successfully"));
        }

        [HttpGet("user/{userId}/summary")]
        public async Task<IActionResult> GetUserAchievementSummary(int userId)
        {
            var summary = await _userAchievementService.GetUserAchievementSummaryAsync(userId);
            return Ok(ApiResponse<UserAchievementSummaryDto>.SuccessResponse(summary));
        }

        [HttpPost("user/{userId}/check")]
        public async Task<IActionResult> CheckAndAwardAchievements(int userId)
        {
            var awarded = await _userAchievementService.CheckAndAwardAchievementsAsync(userId);
            return Ok(ApiResponse<bool>.SuccessResponse(awarded));
        }
    }
}
