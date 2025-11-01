using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class ExerciseRepository : BaseRepository<Exercise>, IExerciseRepository
    {
        public ExerciseRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Exercise>> GetByLessonIdAsync(int lessonId)
        {
            return await _dbSet
                .Where(e => e.LessonId == lessonId)
                .OrderBy(e => e.OrderIndex)
                .ToListAsync();
        }

        public async Task<IEnumerable<Exercise>> GetByTypeAsync(string exerciseType)
        {
            return await _dbSet
                .Where(e => e.ExerciseType == exerciseType)
                .ToListAsync();
        }

        public async Task<Exercise?> GetNextExerciseAsync(int lessonId, int currentOrderIndex)
        {
            return await _dbSet
                .Where(e => e.LessonId == lessonId && e.OrderIndex > currentOrderIndex)
                .OrderBy(e => e.OrderIndex)
                .FirstOrDefaultAsync();
        }

        public async Task<int> GetTotalExperienceByLessonAsync(int lessonId)
        {
            return await _dbSet
                .Where(e => e.LessonId == lessonId)
                .SumAsync(e => e.ExperienceReward);
        }
    }
}