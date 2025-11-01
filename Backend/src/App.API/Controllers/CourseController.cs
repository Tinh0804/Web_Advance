using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoursesController : ControllerBase
    {
        private readonly ICourseService _courseService;
        private readonly ILogger<CoursesController> _logger;

        public CoursesController(
            ICourseService courseService,
            ILogger<CoursesController> logger)
        {
            _courseService = courseService;
            _logger = logger;
        }


        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCourses()
        {
            try
            {
                var courses = await _courseService.GetAllCoursesAsync();
                return Ok(ApiResponse<IEnumerable<CourseDto>>.SuccessResponse(
                    courses, "Courses retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses");
                return StatusCode(500, ApiResponse<IEnumerable<CourseDto>>.ErrorResponse(
                    "An error occurred while retrieving courses"));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<CourseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCourseById(int id)
        {
            try
            {
                var course = await _courseService.GetCourseByIdAsync(id);
                if (course == null)
                {
                    return NotFound(ApiResponse<CourseDto>.ErrorResponse("Course not found"));
                }

                return Ok(ApiResponse<CourseDto>.SuccessResponse(course));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving course {CourseId}", id);
                return StatusCode(500, ApiResponse<CourseDto>.ErrorResponse(
                    "An error occurred while retrieving the course"));
            }
        }

        [HttpGet("languages/{fromLanguageId}/{toLanguageId}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCoursesByLanguagePair(int fromLanguageId, int toLanguageId)
        {
            try
            {
                var courses = await _courseService.GetCoursesByLanguagePairAsync(fromLanguageId, toLanguageId);
                return Ok(ApiResponse<IEnumerable<CourseDto>>.SuccessResponse(courses));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses for language pair {FromId}-{ToId}", 
                    fromLanguageId, toLanguageId);
                return StatusCode(500, ApiResponse<IEnumerable<CourseDto>>.ErrorResponse(
                    "An error occurred while retrieving courses"));
            }
        }

        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<CourseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetUserCourses(int userId)
        {
            try
            {
                var courses = await _courseService.GetUserCoursesAsync(userId);
                return Ok(ApiResponse<IEnumerable<CourseDto>>.SuccessResponse(courses));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving courses for user {UserId}", userId);
                return StatusCode(500, ApiResponse<IEnumerable<CourseDto>>.ErrorResponse(
                    "An error occurred while retrieving user courses"));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<CourseDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<CourseDto>.ErrorResponse("Invalid data"));
                }

                var course = await _courseService.CreateCourseAsync(dto);
                return CreatedAtAction(
                    nameof(GetCourseById),
                    new { id = course.CourseId },
                    ApiResponse<CourseDto>.SuccessResponse(course, "Course created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating course");
                return StatusCode(500, ApiResponse<CourseDto>.ErrorResponse(
                    "An error occurred while creating the course"));
            }
        }

        [HttpPost("enroll")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> EnrollCourse([FromBody] EnrollCourseDto dto)
        {
            try
            {
                var result = await _courseService.EnrollCourseAsync(dto);
                if (!result)
                {
                    return BadRequest(ApiResponse<bool>.ErrorResponse("Already enrolled or enrollment failed"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Enrolled successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error enrolling user {UserId} in course {CourseId}", 
                    dto.UserId, dto.CourseId);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while enrolling in the course"));
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] CreateCourseDto dto)
        {
            try
            {
                var result = await _courseService.UpdateCourseAsync(id, dto);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResponse("Course not found"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Course updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating course {CourseId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while updating the course"));
            }
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                await _courseService.DeleteCourseAsync(id);
                return Ok(ApiResponse<bool>.SuccessResponse(true, "Course deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting course {CourseId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while deleting the course"));
            }
        }
    }
}