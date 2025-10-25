using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Domain.Interfaces
{
    public interface ILanguageRepository : IRepository<Language>
    {
        Task<IEnumerable<Language>> GetSupportedLanguagesAsync();
        Task<Language?> GetByCodeAsync(string languageCode);
        Task<Language?> GetByNameAsync(string languageName);
        Task<IEnumerable<Language>> GetPopularLanguagesAsync(int count);
    }
}