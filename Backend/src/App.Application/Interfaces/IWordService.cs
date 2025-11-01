// IWordService.cs
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IWordService
    {
        Task<IEnumerable<WordDto>> GetAllWordsAsync();
        Task<WordDetailDto?> GetWordByIdAsync(int id);
        Task<IEnumerable<WordDto>> GetWordsByLessonIdAsync(int lessonId);
        Task<IEnumerable<WordDto>> GetWordsByLanguageIdAsync(int languageId);
        Task<WordDto> CreateWordAsync(CreateWordDto dto);
        Task<bool> UpdateWordAsync(int id, UpdateWordDto dto);
        Task<bool> DeleteWordAsync(int id);
        Task<IEnumerable<WordDto>> SearchWordsAsync(string searchTerm, int languageId);
    }
}