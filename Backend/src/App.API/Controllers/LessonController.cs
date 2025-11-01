using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces.Services;
using src.Domain.Enums;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LessonsController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonsController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LessonDto>>> GetAllLessons()
        {
            var lessons = await _lessonService.GetAllLessonsAsync();
            return Ok(ApiResponse<IEnumerable<LessonDto>>.SuccessResponse(
                lessons,"Lessons retrieved successfully"
            ));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LessonDto>> GetLessonById(int id)
        {
            var lesson = await _lessonService.GetLessonByIdAsync(id);

            if (lesson == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Lesson not found"));

            return Ok(ApiResponse<LessonDto>.SuccessResponse(
                lesson,"Lessons retrieved successfully"
            ));
            
        }

        [HttpGet("unit/{unitId}")]
        public async Task<ActionResult<IEnumerable<LessonDto>>> GetLessonsByUnitId(int unitId)
        {
            var lessons = await _lessonService.GetLessonsByUnitIdAsync(unitId);
            return Ok(ApiResponse<IEnumerable<LessonDto>>.SuccessResponse(
                lessons,"Lessons retrieved successfully"
            ));
        }

        [HttpGet("{id}/details")]
        public async Task<ActionResult<LessonDetailDto>> GetLessonWithExercises(int id)
        {
            var lesson = await _lessonService.GetLessonWithExercisesAsync(id);
            
            if (lesson == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Lesson not found" ));

             return Ok(ApiResponse<LessonDetailDto>.SuccessResponse(
                lesson,"Lessons retrieved successfully"
            ));
        }

        [HttpPost]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<ActionResult<LessonDto>> CreateLesson([FromBody] CreateLessonDto createLessonDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ApiResponse<string>.ErrorResponse(ModelState.ToString()));

            try
            {
                var lesson = await _lessonService.CreateLessonAsync(createLessonDto);
                return Ok(ApiResponse<LessonDto>.SuccessResponse(lesson));
                // return CreatedAtAction(nameof(GetLessonById), new { id = lesson.LessonId }, lesson);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateLessonDto updateLessonDto)
        {
            if (!ModelState.IsValid)
                 return BadRequest(ApiResponse<string>.ErrorResponse(ModelState.ToString()));

            var result = await _lessonService.UpdateLessonAsync(id, updateLessonDto);

            if (!result)
                 return NotFound(ApiResponse<string>.ErrorResponse( "Lesson not found"));

            return Ok(ApiResponse<bool>.SuccessResponse(result,"Update lesson success"));
        }
        [HttpDelete("{id}")]
        [Authorize(Roles = SystemRoles.Admin)]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            var result = await _lessonService.DeleteLessonAsync(id);
            
            if (!result)
                  return NotFound(ApiResponse<string>.ErrorResponse( "Lesson not found"));

            // return NoContent();
            return Ok(ApiResponse<bool>.SuccessResponse(result,"Delete lesson success"));
        }


        [HttpGet("{id}/next")]
        public async Task<ActionResult<LessonDto>> GetNextLesson(int id)
        {
            var nextLesson = await _lessonService.GetNextLessonAsync(id);

            if (nextLesson == null)
                return NotFound(ApiResponse<string>.ErrorResponse( "No next lesson found"));

              return Ok(ApiResponse<LessonDto>.SuccessResponse(nextLesson));
        }

        [HttpGet("{id}/accessible")]
        public async Task<ActionResult<bool>> IsLessonAccessible(int id, [FromQuery] int userId)
        {
            var isAccessible = await _lessonService.IsLessonAccessibleAsync(id, userId);
             return Ok(ApiResponse<bool>.SuccessResponse(isAccessible,"This lesson you can access"));
        }
    }
}