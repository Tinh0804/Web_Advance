using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WordsController : ControllerBase
    {
        private readonly IWordService _wordService;

        public WordsController(IWordService wordService)
        {
            _wordService = wordService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWords()
        {
            var words = await _wordService.GetAllWordsAsync();
            return Ok(ApiResponse<IEnumerable<WordDto>>.SuccessResponse(words));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWordById(int id)
        {
            var word = await _wordService.GetWordByIdAsync(id);
            if (word == null)
                return NotFound(ApiResponse<string>.ErrorResponse("Word not found"));

            return Ok(ApiResponse<WordDetailDto>.SuccessResponse(word));
        }

        [HttpGet("lesson/{lessonId}")]
        public async Task<IActionResult> GetWordsByLessonId(int lessonId)
        {
            var words = await _wordService.GetWordsByLessonIdAsync(lessonId);
            return Ok(ApiResponse<IEnumerable<WordDto>>.SuccessResponse(words));
        }

        [HttpGet("language/{languageId}")]
        public async Task<IActionResult> GetWordsByLanguageId(int languageId)
        {
            var words = await _wordService.GetWordsByLanguageIdAsync(languageId);
            return Ok(ApiResponse<IEnumerable<WordDto>>.SuccessResponse(words));
        }

        [HttpPost]
        public async Task<IActionResult> CreateWord([FromBody] CreateWordDto dto)
        {
            try
            {
                var word = await _wordService.CreateWordAsync(dto);
                return CreatedAtAction(nameof(GetWordById), new { id = word.WordId },
                    ApiResponse<WordDto>.SuccessResponse(word));
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ApiResponse<string>.ErrorResponse(ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWord(int id, [FromBody] UpdateWordDto dto)
        {
            var success = await _wordService.UpdateWordAsync(id, dto);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("Word not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Word updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWord(int id)
        {
            var success = await _wordService.DeleteWordAsync(id);
            if (!success)
                return NotFound(ApiResponse<string>.ErrorResponse("Word not found"));

            return Ok(ApiResponse<string>.SuccessResponse("Word deleted successfully"));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchWords([FromQuery] string searchTerm, [FromQuery] int languageId)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(ApiResponse<string>.ErrorResponse("Search term is required"));

            var words = await _wordService.SearchWordsAsync(searchTerm, languageId);
            return Ok(ApiResponse<IEnumerable<WordDto>>.SuccessResponse(words));
        }
    }
}
