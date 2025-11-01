using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface ILessonRepository : IRepository<Lesson>
    {
        Task<IEnumerable<Lesson>> GetLessonsByUnitIdAsync(int unitId);
        Task<Lesson?> GetLessonWithExercisesAsync(int lessonId);
        Task<Lesson?> GetNextLessonAsync(int currentLessonId);
        Task<bool> IsLessonUnlockedAsync(int lessonId, int userId);
    }
}