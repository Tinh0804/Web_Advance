using src.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using src.Domain.Entities;
using src.API.Extensions;
using src.Application.DTOs.Response;
using src.Domain.Enums;

namespace src.API.Controllers
{
    [ServiceFilter(typeof(TransactionFilter))]
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IUserProfileService _profileService;
        // private readonly IStreakService _streakService;

        public ProfileController(
            IUserProfileService progressService
            // ,
            // IStreakService streakService
            )
        {
            _profileService = progressService;
            // _streakService = streakService;
        }

        [HttpGet("myInfo")]
        public async Task<IActionResult> GetMyInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;

            var profile = await _profileService.GetUserProfileByAccountIdAsync(userId);
            return Ok(ApiResponse<UserProfile>.SuccessResponse(profile));
        }
        [HttpGet]
        [Authorize(Roles = $"{SystemRoles.Admin}")]
        public async Task<IActionResult> GetProfiles()
        {
            try
            {
                var profiles = await _profileService.GetAllAsync();
                return Ok(ApiResponse<IEnumerable<UserProfile>>.SuccessResponse(profiles));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }


        // [HttpGet("streak")]
        // public async Task<IActionResult> GetStreakInfo()
        // {
        //     var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
        //     var currentStreak = await _streakService.GetCurrentStreakAsync(userId);
        //     var goalMet = await _streakService.IsDailyGoalMetAsync(userId);
        //     var weeklyProgress = await _streakService.GetWeeklyProgressAsync(userId);
            
        //     return Ok(new 
        //     { 
        //         currentStreak, 
        //         dailyGoalMet = goalMet, 
        //         weeklyProgress 
        //     });
        // }

        [HttpPost("hearts/refill")]
        public async Task<IActionResult> RefillHearts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            // await _progressService.RefillHeartsAsync(userId);
            return Ok(ApiResponse<string>.SuccessResponse("Hearts refilled successfully"));
        }

        [HttpGet("achievements")]
        public async Task<IActionResult> GetAchievements()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
            // var achievements = await _progressService.CheckAchievementsAsync(userId);
            // return Ok(achievements);
            return Ok("Chưa triển khai má ơi!");
        }
    }
}