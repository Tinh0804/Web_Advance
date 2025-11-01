// IUserCourseService.cs
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IUserCourseService
    {
        Task<IEnumerable<UserCourseDto>> GetUserCoursesAsync(int userId);
        Task<UserCourseDetailDto?> GetUserCourseAsync(int userId, int courseId);
        Task<UserCourseDto> EnrollUserInCourseAsync(CreateUserCourseDto dto);
        Task<bool> UpdateUserProgressAsync(int userCourseId, UpdateUserCourseProgressDto dto);
        Task<bool> CompleteUserCourseAsync(int userCourseId);
        Task<IEnumerable<UserCourseDto>> GetCompletedCoursesAsync(int userId);
        Task<int> GetTotalExperienceAsync(int userId);
    }
}