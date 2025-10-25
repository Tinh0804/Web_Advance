using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class LanguageRepository : BaseRepository<Language>, ILanguageRepository
    {
        public LanguageRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Language>> GetSupportedLanguagesAsync()
        {
            return await _dbSet
                .Where(l => l.IsSupported)
                .OrderBy(l => l.LanguageName)
                .ToListAsync();
        }

        public async Task<Language?> GetByCodeAsync(string languageCode)
        {
            return await _dbSet
                .FirstOrDefaultAsync(l => l.LanguageCode == languageCode);
        }

        public async Task<Language?> GetByNameAsync(string languageName)
        {
            return await _dbSet
                .FirstOrDefaultAsync(l => l.LanguageName == languageName);
        }

        public async Task<IEnumerable<Language>> GetPopularLanguagesAsync(int count)
        {
            return await _dbSet
                .Where(l => l.IsSupported)
                .Include(l => l.ToCourses)
                .OrderByDescending(l => l.ToCourses!.Count)
                .Take(count)
                .ToListAsync();
        }
    }
}