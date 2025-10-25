using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;
        private readonly ILogger<ExercisesController> _logger;

        public ExercisesController(
            IExerciseService exerciseService,
            ILogger<ExercisesController> logger)
        {
            _exerciseService = exerciseService;
            _logger = logger;
        }

        /// <summary>
        /// Get exercises by lesson ID
        /// </summary>
        [HttpGet("lesson/{lessonId}")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ExerciseDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetExercisesByLesson(int lessonId)
        {
            try
            {
                var exercises = await _exerciseService.GetExercisesByLessonAsync(lessonId);
                return Ok(ApiResponse<IEnumerable<ExerciseDto>>.SuccessResponse(exercises));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving exercises for lesson {LessonId}", lessonId);
                return StatusCode(500, ApiResponse<IEnumerable<ExerciseDto>>.ErrorResponse(
                    "An error occurred while retrieving exercises"));
            }
        }

        /// <summary>
        /// Get exercise by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetExerciseById(int id)
        {
            try
            {
                var exercise = await _exerciseService.GetExerciseByIdAsync(id);
                if (exercise == null)
                {
                    return NotFound(ApiResponse<ExerciseDto>.ErrorResponse("Exercise not found"));
                }

                return Ok(ApiResponse<ExerciseDto>.SuccessResponse(exercise));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving exercise {ExerciseId}", id);
                return StatusCode(500, ApiResponse<ExerciseDto>.ErrorResponse(
                    "An error occurred while retrieving the exercise"));
            }
        }

        /// <summary>
        /// Get next exercise in lesson
        /// </summary>
        [HttpGet("lesson/{lessonId}/next/{currentOrderIndex}")]
        [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetNextExercise(int lessonId, int currentOrderIndex)
        {
            try
            {
                var exercise = await _exerciseService.GetNextExerciseAsync(lessonId, currentOrderIndex);
                return Ok(ApiResponse<ExerciseDto>.SuccessResponse(exercise));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving next exercise for lesson {LessonId}", lessonId);
                return StatusCode(500, ApiResponse<ExerciseDto>.ErrorResponse(
                    "An error occurred while retrieving the next exercise"));
            }
        }

        /// <summary>
        /// Create new exercise
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<ExerciseDto>.ErrorResponse("Invalid data"));
                }

                var exercise = await _exerciseService.CreateExerciseAsync(dto);
                return CreatedAtAction(
                    nameof(GetExerciseById),
                    new { id = exercise.ExerciseId },
                    ApiResponse<ExerciseDto>.SuccessResponse(exercise, "Exercise created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating exercise");
                return StatusCode(500, ApiResponse<ExerciseDto>.ErrorResponse(
                    "An error occurred while creating the exercise"));
            }
        }

        /// <summary>
        /// Submit exercise answer
        /// </summary>
        [HttpPost("submit")]
        [ProducesResponseType(typeof(ApiResponse<ExerciseResultDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<ExerciseResultDto>.ErrorResponse("Invalid data"));
                }

                var result = await _exerciseService.SubmitAnswerAsync(dto);
                return Ok(ApiResponse<ExerciseResultDto>.SuccessResponse(
                    result, 
                    result.IsCorrect ? "Correct answer!" : "Incorrect answer"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error submitting answer for exercise {ExerciseId}", dto.ExerciseId);
                return StatusCode(500, ApiResponse<ExerciseResultDto>.ErrorResponse(
                    "An error occurred while submitting the answer"));
            }
        }

        /// <summary>
        /// Update exercise
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateExercise(int id, [FromBody] CreateExerciseDto dto)
        {
            try
            {
                var result = await _exerciseService.UpdateExerciseAsync(id, dto);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResponse("Exercise not found"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Exercise updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating exercise {ExerciseId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while updating the exercise"));
            }
        }

        /// <summary>
        /// Delete exercise
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            try
            {
                await _exerciseService.DeleteExerciseAsync(id);
                return Ok(ApiResponse<bool>.SuccessResponse(true, "Exercise deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting exercise {ExerciseId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while deleting the exercise"));
            }
        }
    }
}
