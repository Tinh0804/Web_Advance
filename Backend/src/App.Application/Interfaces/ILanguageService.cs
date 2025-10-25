using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface ILanguageService
    {
        Task<IEnumerable<LanguageDto>> GetAllLanguagesAsync();
        Task<IEnumerable<LanguageDto>> GetSupportedLanguagesAsync();
        Task<IEnumerable<LanguageDto>> GetPopularLanguagesAsync(int count = 10);
        Task<LanguageDto?> GetLanguageByIdAsync(int id);
        Task<LanguageDto?> GetLanguageByCodeAsync(string code);
        Task<LanguageDto> CreateLanguageAsync(CreateLanguageDto dto);
        Task<bool> UpdateLanguageAsync(int id, CreateLanguageDto dto);
        Task<bool> DeleteLanguageAsync(int id);
    }
}