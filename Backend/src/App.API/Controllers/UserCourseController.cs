using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCoursesController : ControllerBase
    {
        private readonly IUserCourseService _userCourseService;

        public UserCoursesController(IUserCourseService userCourseService)
        {
            _userCourseService = userCourseService;
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserCourses(int userId)
        {
            var courses = await _userCourseService.GetUserCoursesAsync(userId);
            return Ok(ApiResponse<IEnumerable<UserCourseDto>>.SuccessResponse(courses));
        }

        [HttpGet("user/{userId}/course/{courseId}")]
        public async Task<IActionResult> GetUserCourse(int userId, int courseId)
        {
            var userCourse = await _userCourseService.GetUserCourseAsync(userId, courseId);
            if (userCourse == null)
                return NotFound(ApiResponse<string>.ErrorResponse("User course not found"));

            return Ok(ApiResponse<UserCourseDetailDto>.SuccessResponse(userCourse));
        }

        [HttpPost]
        public async Task<IActionResult> EnrollInCourse([FromBody] CreateUserCourseDto dto)
        {
            try
            {
                var userCourse = await _userCourseService.EnrollUserInCourseAsync(dto);
                return CreatedAtAction(nameof(GetUserCourse), 
                    new { userId = dto.UserId, courseId = dto.CourseId },
                    ApiResponse<UserCourseDto>.SuccessResponse(userCourse));
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

        [HttpPut("{userCourseId}/progress")]
        public async Task<IActionResult> UpdateProgress(int userCourseId, [FromBody] UpdateUserCourseProgressDto dto)
        {
            var success = await _userCourseService.UpdateUserProgressAsync(userCourseId, dto);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("User course not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Progress updated successfully"));
        }

        [HttpPost("{userCourseId}/complete")]
        public async Task<IActionResult> CompleteCourse(int userCourseId)
        {
            var success = await _userCourseService.CompleteUserCourseAsync(userCourseId);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("User course not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Course completed successfully"));
        }

        [HttpGet("user/{userId}/completed")]
        public async Task<IActionResult> GetCompletedCourses(int userId)
        {
            var completedCourses = await _userCourseService.GetCompletedCoursesAsync(userId);
            return Ok(ApiResponse<IEnumerable<UserCourseDto>>.SuccessResponse(completedCourses));
        }

        [HttpGet("user/{userId}/total-experience")]
        public async Task<IActionResult> GetTotalExperience(int userId)
        {
            var totalXP = await _userCourseService.GetTotalExperienceAsync(userId);
            return Ok(ApiResponse<int>.SuccessResponse(totalXP));
        }
    }
}
