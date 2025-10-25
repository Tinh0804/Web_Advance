using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class CourseService : ICourseService
    {
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<CourseDto>> GetAllCoursesAsync()
        {
            var courses = await _unitOfWork.Courses.GetAllAsync();
            return courses.Select(MapToDto);
        }

        public async Task<CourseDto?> GetCourseByIdAsync(int id)
        {
            var course = await _unitOfWork.Courses.GetWithUnitsAsync(id);
            return course != null ? MapToDto(course) : null;
        }

        public async Task<IEnumerable<CourseDto>> GetCoursesByLanguagePairAsync(int fromLanguageId, int toLanguageId)
        {
            var courses = await _unitOfWork.Courses.GetByLanguagePairAsync(fromLanguageId, toLanguageId);
            return courses.Select(MapToDto);
        }

        public async Task<IEnumerable<CourseDto>> GetUserCoursesAsync(int userId)
        {
            var courses = await _unitOfWork.Courses.GetUserCoursesAsync(userId);
            return courses.Select(MapToDto);
        }

        public async Task<CourseDto> CreateCourseAsync(CreateCourseDto dto)
        {
            var course = new Course
            {
                CourseName = dto.CourseName,
                FromLanguageId = dto.FromLanguageId,
                ToLanguageId = dto.ToLanguageId,
                DifficultyLevel = dto.DifficultyLevel,
                CourseIcon = dto.CourseIcon
            };

            await _unitOfWork.Courses.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(course);
        }

        public async Task<bool> EnrollCourseAsync(EnrollCourseDto dto)
        {
            var isEnrolled = await _unitOfWork.Courses.IsEnrolledAsync(dto.UserId, dto.CourseId);
            if (isEnrolled) return false;

            // Would need UserCourse repository to complete this
            // For now, just return success
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateCourseAsync(int id, CreateCourseDto dto)
        {
            var course = await _unitOfWork.Courses.GetByIdAsync(id);
            if (course == null) return false;

            course.CourseName = dto.CourseName;
            course.FromLanguageId = dto.FromLanguageId;
            course.ToLanguageId = dto.ToLanguageId;
            course.DifficultyLevel = dto.DifficultyLevel;
            course.CourseIcon = dto.CourseIcon;

            await _unitOfWork.Courses.UpdateAsync(course);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            await _unitOfWork.Courses.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private CourseDto MapToDto(Course course)
        {
            return new CourseDto
            {
                CourseId = course.CourseId,
                CourseName = course.CourseName,
                FromLanguageId = course.FromLanguageId,
                FromLanguageName = course.FromLanguage?.LanguageName ?? "",
                ToLanguageId = course.ToLanguageId,
                ToLanguageName = course.ToLanguage?.LanguageName ?? "",
                DifficultyLevel = course.DifficultyLevel,
                CourseIcon = course.CourseIcon,
                TotalUnits = course.Units?.Count ?? 0,
                CompletedUnits = 0,
                ProgressPercentage = 0
            };
        }
    }
}