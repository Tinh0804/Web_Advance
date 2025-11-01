// WordRepository.cs
using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class WordRepository : IWordRepository
    {
        private readonly ApplicationDbContext _context;

        public WordRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Word?> GetByIdAsync(int id)
        {
            return await _context.Words.FindAsync(id);
        }

        public async Task<IEnumerable<Word>> GetAllAsync()
        {
            return await _context.Words.ToListAsync();
        }

        public async Task<Word> AddAsync(Word entity)
        {
            await _context.Words.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Word entity)
        {
            _context.Words.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var word = await GetByIdAsync(id);
            if (word != null)
            {
                _context.Words.Remove(word);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Words.AnyAsync(w => w.WordId == id);
        }

        public async Task<IEnumerable<Word>> GetWordsByLessonIdAsync(int lessonId)
        {
            return await _context.Words
                .Where(w => w.LessonId == lessonId)
                .Include(w => w.Language)
                .Include(w => w.Lesson)
                .ToListAsync();
        }

        public async Task<IEnumerable<Word>> GetWordsByLanguageIdAsync(int languageId)
        {
            return await _context.Words
                .Where(w => w.LanguageId == languageId)
                .Include(w => w.Lesson)
                .ToListAsync();
        }

        public async Task<IEnumerable<Word>> GetWordsByTypeAsync(int lessonId, string wordType)
        {
            return await _context.Words
                .Where(w => w.LessonId == lessonId && w.WordType == wordType)
                .ToListAsync();
        }

        public async Task<Word?> GetWordWithDetailsAsync(int wordId)
        {
            return await _context.Words
                .Include(w => w.Language)
                .Include(w => w.Lesson)
                .FirstOrDefaultAsync(w => w.WordId == wordId);
        }

        public async Task<IEnumerable<Word>> SearchWordsAsync(string searchTerm, int languageId)
        {
            return await _context.Words
                .Where(w => w.LanguageId == languageId && 
                           (w.WordName.Contains(searchTerm) || 
                            w.Translation.Contains(searchTerm)))
                .Include(w => w.Language)
                .Take(50)
                .ToListAsync();
        }
    }
}