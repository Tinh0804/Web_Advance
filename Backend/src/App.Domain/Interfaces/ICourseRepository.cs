using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface ICourseRepository : IRepository<Course>
    {
        Task<IEnumerable<Course>> GetByLanguagePairAsync(int fromLanguageId, int toLanguageId);
        Task<IEnumerable<Course>> GetByDifficultyAsync(string difficultyLevel);
        Task<Course?> GetWithUnitsAsync(int courseId);
        Task<IEnumerable<Course>> GetUserCoursesAsync(int userId);
        Task<bool> IsEnrolledAsync(int userId, int courseId);
    }
}