// using src.Application.DTOs.ModelDto;
// using src.Application.Interfaces;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using System.Security.Claims;

// namespace src.API.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     [Authorize]
//     public class LearningController : ControllerBase
//     {
//         private readonly ILearningService _learningService;
//         private readonly IProgressService _progressService;

//         public LearningController(
//             ILearningService learningService, 
//             IProgressService progressService)
//         {
//             _learningService = learningService;
//             _progressService = progressService;
//         }

//         [HttpPost("lessons/{lessonId}/start")]
//         public async Task<IActionResult> StartLesson(int lessonId)
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
                
//                 if (!await _progressService.CanTakeLesson(userId, lessonId))
//                 {
//                     return BadRequest(new { message = "Not enough hearts or lesson locked" });
//                 }

//                 var session = await _learningService.StartLessonAsync(lessonId, userId);
//                 return Ok(session);
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         [HttpPost("sessions/answer")]
//         public async Task<IActionResult> SubmitAnswer([FromBody] SubmitAnswerDto submitAnswer)
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
//                 var result = await _learningService.SubmitAnswerAsync(submitAnswer, userId);
//                 return Ok(result);
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         [HttpPost("sessions/{sessionId}/complete")]
//         public async Task<IActionResult> CompleteLesson(int sessionId)
//         {
//             try
//             {
//                 var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
//                 var result = await _learningService.CompleteLessonAsync(sessionId, userId);
//                 return Ok(result);
//             }
//             catch (Exception ex)
//             {
//                 return BadRequest(new { message = ex.Message });
//             }
//         }

//         [HttpGet("practice/{courseId}")]
//         public async Task<IActionResult> GetPracticeExercises(int courseId, [FromQuery] int count = 10)
//         {
//             var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value!;
//             var exercises = await _learningService.GetPracticeExercisesAsync(courseId, userId, count);
//             return Ok(exercises);
//         }
//     }
// }