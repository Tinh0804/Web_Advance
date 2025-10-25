using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IExerciseRepository : IRepository<Exercise>
    {
        Task<IEnumerable<Exercise>> GetByLessonIdAsync(int lessonId);
        Task<IEnumerable<Exercise>> GetByTypeAsync(string exerciseType);
        Task<Exercise?> GetNextExerciseAsync(int lessonId, int currentOrderIndex);
        Task<int> GetTotalExperienceByLessonAsync(int lessonId);
    }
}