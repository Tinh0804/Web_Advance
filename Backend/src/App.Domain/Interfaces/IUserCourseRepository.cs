// IUserCourseRepository.cs
using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IUserCourseRepository : IRepository<UserCourse>
    {
        Task<IEnumerable<UserCourse>> GetUserCoursesAsync(int userId);
        Task<UserCourse?> GetUserCourseAsync(int userId, int courseId);
        Task<UserCourse?> GetUserCourseWithDetailsAsync(int userId, int courseId);
        Task<IEnumerable<UserCourse>> GetCompletedCoursesAsync(int userId);
        Task<int> GetTotalExperienceByUserAsync(int userId);
    }
}