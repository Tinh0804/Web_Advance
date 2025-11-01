using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class LessonRepository : BaseRepository<Lesson>, ILessonRepository
    {
        public LessonRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Lesson>> GetLessonsByUnitIdAsync(int unitId)
        {
            return await _context.Set<Lesson>()
                .Where(l => l.UnitId == unitId)
                .OrderBy(l => l.OrderIndex)
                .Include(l => l.Unit)
                .ToListAsync();
        }

        public async Task<Lesson?> GetLessonWithExercisesAsync(int lessonId)
        {
            return await _context.Set<Lesson>()
                .Include(l => l.Exercises)
                .Include(l => l.Unit)
                .FirstOrDefaultAsync(l => l.LessonId == lessonId);
        }


        public async Task<Lesson?> GetNextLessonAsync(int currentLessonId)
        {
            var currentLesson = await _context.Set<Lesson>()
                .FirstOrDefaultAsync(l => l.LessonId == currentLessonId);

            if (currentLesson == null) return null;

            return await _context.Set<Lesson>()
                .Where(l => l.UnitId == currentLesson.UnitId && l.OrderIndex > currentLesson.OrderIndex)
                .OrderBy(l => l.OrderIndex)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsLessonUnlockedAsync(int lessonId, int userId)
        {
            var lesson = await _context.Set<Lesson>().FindAsync(lessonId);
            
            if (lesson == null || !lesson.UnlockRequired) return true;

            var userCourse = await _context.Set<UserCourse>()
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CurrentLessonId == lessonId);

            return userCourse != null;
        }
    }
}