using Microsoft.AspNetCore.Mvc;
using src.Application.DTOs;
using src.Application.DTOs.Response;
using src.Application.Interfaces;

namespace src.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LanguagesController : ControllerBase
    {
        private readonly ILanguageService _languageService;
        private readonly ILogger<LanguagesController> _logger;

        public LanguagesController(
            ILanguageService languageService,
            ILogger<LanguagesController> logger)
        {
            _languageService = languageService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<LanguageDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllLanguages()
        {
            try
            {
                var languages = await _languageService.GetAllLanguagesAsync();
                return Ok(ApiResponse<IEnumerable<LanguageDto>>.SuccessResponse(
                    languages, "Languages retrieved successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving languages");
                return StatusCode(500, ApiResponse<IEnumerable<LanguageDto>>.ErrorResponse(
                    "An error occurred while retrieving languages"));
            }
        }

        [HttpGet("supported")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<LanguageDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSupportedLanguages()
        {
            try
            {
                var languages = await _languageService.GetSupportedLanguagesAsync();
                return Ok(ApiResponse<IEnumerable<LanguageDto>>.SuccessResponse(languages));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving supported languages");
                return StatusCode(500, ApiResponse<IEnumerable<LanguageDto>>.ErrorResponse(
                    "An error occurred while retrieving supported languages"));
            }
        }

        [HttpGet("popular")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<LanguageDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPopularLanguages([FromQuery] int count = 10)
        {
            try
            {
                var languages = await _languageService.GetPopularLanguagesAsync(count);
                return Ok(ApiResponse<IEnumerable<LanguageDto>>.SuccessResponse(languages));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving popular languages");
                return StatusCode(500, ApiResponse<IEnumerable<LanguageDto>>.ErrorResponse(
                    "An error occurred while retrieving popular languages"));
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<LanguageDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLanguageById(int id)
        {
            try
            {
                var language = await _languageService.GetLanguageByIdAsync(id);
                if (language == null)
                {
                    return NotFound(ApiResponse<LanguageDto>.ErrorResponse("Language not found"));
                }

                return Ok(ApiResponse<LanguageDto>.SuccessResponse(language));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving language {LanguageId}", id);
                return StatusCode(500, ApiResponse<LanguageDto>.ErrorResponse(
                    "An error occurred while retrieving the language"));
            }
        }
        [HttpGet("code/{code}")]
        [ProducesResponseType(typeof(ApiResponse<LanguageDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetLanguageByCode(string code)
        {
            try
            {
                var language = await _languageService.GetLanguageByCodeAsync(code);
                if (language == null)
                {
                    return NotFound(ApiResponse<LanguageDto>.ErrorResponse("Language not found"));
                }

                return Ok(ApiResponse<LanguageDto>.SuccessResponse(language));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving language by code {Code}", code);
                return StatusCode(500, ApiResponse<LanguageDto>.ErrorResponse(
                    "An error occurred while retrieving the language"));
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<LanguageDto>), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateLanguage([FromBody] CreateLanguageDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ApiResponse<LanguageDto>.ErrorResponse("Invalid data"));
                }

                var language = await _languageService.CreateLanguageAsync(dto);
                return CreatedAtAction(
                    nameof(GetLanguageById),
                    new { id = language.LanguageId },
                    ApiResponse<LanguageDto>.SuccessResponse(language, "Language created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating language");
                return StatusCode(500, ApiResponse<LanguageDto>.ErrorResponse(
                    "An error occurred while creating the language"));
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateLanguage(int id, [FromBody] CreateLanguageDto dto)
        {
            try
            {
                var result = await _languageService.UpdateLanguageAsync(id, dto);
                if (!result)
                {
                    return NotFound(ApiResponse<bool>.ErrorResponse("Language not found"));
                }

                return Ok(ApiResponse<bool>.SuccessResponse(true, "Language updated successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating language {LanguageId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while updating the language"));
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteLanguage(int id)
        {
            try
            {
                await _languageService.DeleteLanguageAsync(id);
                return Ok(ApiResponse<bool>.SuccessResponse(true, "Language deleted successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting language {LanguageId}", id);
                return StatusCode(500, ApiResponse<bool>.ErrorResponse(
                    "An error occurred while deleting the language"));
            }
        }
    }
}