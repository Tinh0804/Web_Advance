// IWordRepository.cs
using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IWordRepository : IRepository<Word>
    {
        Task<IEnumerable<Word>> GetWordsByLessonIdAsync(int lessonId);
        Task<IEnumerable<Word>> GetWordsByLanguageIdAsync(int languageId);
        Task<IEnumerable<Word>> GetWordsByTypeAsync(int lessonId, string wordType);
        Task<Word?> GetWordWithDetailsAsync(int wordId);
        Task<IEnumerable<Word>> SearchWordsAsync(string searchTerm, int languageId);
    }
}