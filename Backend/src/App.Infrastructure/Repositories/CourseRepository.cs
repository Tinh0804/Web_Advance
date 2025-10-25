using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class CourseRepository : BaseRepository<Course>, ICourseRepository
    {
        public CourseRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Course>> GetByLanguagePairAsync(int fromLanguageId, int toLanguageId)
        {
            return await _dbSet
                .Include(c => c.FromLanguage)
                .Include(c => c.ToLanguage)
                .Where(c => c.FromLanguageId == fromLanguageId && c.ToLanguageId == toLanguageId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Course>> GetByDifficultyAsync(string difficultyLevel)
        {
            return await _dbSet
                .Include(c => c.FromLanguage)
                .Include(c => c.ToLanguage)
                .Where(c => c.DifficultyLevel == difficultyLevel)
                .ToListAsync();
        }

        public async Task<Course?> GetWithUnitsAsync(int courseId)
        {
            return await _dbSet
                .Include(c => c.FromLanguage)
                .Include(c => c.ToLanguage)
                .Include(c => c.Units)
                .FirstOrDefaultAsync(c => c.CourseId == courseId);
        }

        public async Task<IEnumerable<Course>> GetUserCoursesAsync(int userId)
        {
            return await _dbSet
                .Include(c => c.FromLanguage)
                .Include(c => c.ToLanguage)
                .Include(c => c.UserCourses)
                .Where(c => c.UserCourses!.Any(uc => uc.UserId == userId))
                .ToListAsync();
        }

        public async Task<bool> IsEnrolledAsync(int userId, int courseId)
        {
            return await _context.Set<UserCourse>()
                .AnyAsync(uc => uc.UserId == userId && uc.CourseId == courseId);
        }
    }
}
