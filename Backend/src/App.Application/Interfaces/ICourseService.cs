using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface ICourseService
    {
        Task<IEnumerable<CourseDto>> GetAllCoursesAsync();
        Task<CourseDto?> GetCourseByIdAsync(int id);
        Task<IEnumerable<CourseDto>> GetCoursesByLanguagePairAsync(int fromLanguageId, int toLanguageId);
        Task<IEnumerable<CourseDto>> GetUserCoursesAsync(int userId);
        Task<CourseDto> CreateCourseAsync(CreateCourseDto dto);
        Task<bool> EnrollCourseAsync(EnrollCourseDto dto);
        Task<bool> UpdateCourseAsync(int id, CreateCourseDto dto);
        Task<bool> DeleteCourseAsync(int id);
    }
}