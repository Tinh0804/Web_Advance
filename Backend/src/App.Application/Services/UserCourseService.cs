// UserCourseService.cs
using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class UserCourseService : IUserCourseService
    {
        private readonly IUserCourseRepository _userCourseRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IUnitRepository _unitRepository;
        private readonly ILessonRepository _lessonRepository;

        public UserCourseService(
            IUserCourseRepository userCourseRepository,
            ICourseRepository courseRepository,
            IUserProfileRepository userProfileRepository,
            IUnitRepository unitRepository,
            ILessonRepository lessonRepository)
        {
            _userCourseRepository = userCourseRepository;
            _courseRepository = courseRepository;
            _userProfileRepository = userProfileRepository;
            _unitRepository = unitRepository;
            _lessonRepository = lessonRepository;
        }

        public async Task<IEnumerable<UserCourseDto>> GetUserCoursesAsync(int userId)
        {
            var userCourses = await _userCourseRepository.GetUserCoursesAsync(userId);
            return userCourses.Select(MapToDto);
        }

        public async Task<UserCourseDetailDto?> GetUserCourseAsync(int userId, int courseId)
        {
            var userCourse = await _userCourseRepository.GetUserCourseWithDetailsAsync(userId, courseId);
            if (userCourse == null) return null;

            return new UserCourseDetailDto
            {
                UserCourseId = userCourse.UserCourseId,
                UserId = userCourse.UserId,
                Course = new CourseDto
                {
                    CourseId = userCourse.Course.CourseId,
                    CourseName = userCourse.Course.CourseName,
                    // Description = userCourse.Course.Description
                },
                CurrentUnit = userCourse.CurrentUnit != null ? new UnitDto
                {
                    UnitId = userCourse.CurrentUnit.UnitId,
                    UnitName = userCourse.CurrentUnit.UnitName,
                    OrderIndex = userCourse.CurrentUnit.OrderIndex
                } : null,
                CurrentLesson = userCourse.CurrentLesson != null ? new LessonDto
                {
                    LessonId = userCourse.CurrentLesson.LessonId,
                    LessonName = userCourse.CurrentLesson.LessonName,
                    OrderIndex = (int)userCourse.CurrentLesson.OrderIndex
                } : null,
                TotalExperienceEarned = userCourse.TotalExperienceEarned ?? 0,
                IsCompleted = userCourse.IsCompleted,
                ProgressPercentage = CalculateProgressPercentage(userCourse)
            };
        }

        public async Task<UserCourseDto> EnrollUserInCourseAsync(CreateUserCourseDto dto)
        {
            // Kiểm tra user tồn tại
            var userExists = await _userProfileRepository.ExistsAsync(dto.UserId);
            if (!userExists)
                throw new ArgumentException("User not found");

            // Kiểm tra course tồn tại
            var courseExists = await _courseRepository.ExistsAsync(dto.CourseId);
            if (!courseExists)
                throw new ArgumentException("Course not found");

            // Kiểm tra user đã enroll chưa
            var existingEnrollment = await _userCourseRepository
                .GetUserCourseAsync(dto.UserId, dto.CourseId);
            
            if (existingEnrollment != null)
                throw new InvalidOperationException("User is already enrolled in this course");

            // Lấy unit và lesson đầu tiên
            var units = await _unitRepository.GetUnitsByCourseIdAsync(dto.CourseId);
            var firstUnit = units.OrderBy(u => u.OrderIndex).FirstOrDefault();
            var firstLesson = firstUnit?.Lessons?.OrderBy(l => l.OrderIndex).FirstOrDefault();

            var userCourse = new UserCourse
            {
                UserId = dto.UserId,
                CourseId = dto.CourseId,
                CurrentUnitId = firstUnit?.UnitId,
                CurrentLessonId = firstLesson?.LessonId,
                TotalExperienceEarned = 0,
                IsCompleted = false
            };

            var created = await _userCourseRepository.AddAsync(userCourse);
            return MapToDto(created);
        }

        public async Task<bool> UpdateUserProgressAsync(int userCourseId, UpdateUserCourseProgressDto dto)
        {
            var userCourse = await _userCourseRepository.GetByIdAsync(userCourseId);
            if (userCourse == null) return false;

            if (dto.CurrentUnitId.HasValue)
                userCourse.CurrentUnitId = dto.CurrentUnitId.Value;

            if (dto.CurrentLessonId.HasValue)
                userCourse.CurrentLessonId = dto.CurrentLessonId.Value;

            if (dto.ExperienceGained.HasValue)
            {
                userCourse.TotalExperienceEarned = 
                    (userCourse.TotalExperienceEarned ?? 0) + dto.ExperienceGained.Value;
            }

            await _userCourseRepository.UpdateAsync(userCourse);
            return true;
        }

        public async Task<bool> CompleteUserCourseAsync(int userCourseId)
        {
            var userCourse = await _userCourseRepository.GetByIdAsync(userCourseId);
            if (userCourse == null) return false;

            userCourse.IsCompleted = true;
            await _userCourseRepository.UpdateAsync(userCourse);
            return true;
        }

        public async Task<IEnumerable<UserCourseDto>> GetCompletedCoursesAsync(int userId)
        {
            var completedCourses = await _userCourseRepository.GetCompletedCoursesAsync(userId);
            return completedCourses.Select(MapToDto);
        }

        public async Task<int> GetTotalExperienceAsync(int userId)
        {
            return await _userCourseRepository.GetTotalExperienceByUserAsync(userId);
        }

        private UserCourseDto MapToDto(UserCourse userCourse)
        {
            return new UserCourseDto
            {
                UserCourseId = userCourse.UserCourseId,
                UserId = userCourse.UserId,
                CourseId = userCourse.CourseId,
                CourseName = userCourse.Course?.CourseName ?? "",
                CurrentUnitId = userCourse.CurrentUnitId,
                CurrentLessonId = userCourse.CurrentLessonId,
                TotalExperienceEarned = userCourse.TotalExperienceEarned ?? 0,
                IsCompleted = userCourse.IsCompleted,
                ProgressPercentage = CalculateProgressPercentage(userCourse)
            };
        }

        private int CalculateProgressPercentage(UserCourse userCourse)
        {
            // Logic tính % progress dựa trên số lessons hoàn thành
            // Placeholder - cần implement logic phức tạp hơn
            if (userCourse.IsCompleted) return 100;
            if (userCourse.CurrentLessonId == null) return 0;
            
            return 0; // Cần tính toán thực tế
        }
    }
}