// UserCourseDTOs.cs
namespace src.Application.DTOs
{
    public class UserCourseDto
    {
        public int UserCourseId { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public string CourseName { get; set; }
        public int? CurrentUnitId { get; set; }
        public int? CurrentLessonId { get; set; }
        public int TotalExperienceEarned { get; set; }
        public bool IsCompleted { get; set; }
        public int ProgressPercentage { get; set; }
    }

    public class CreateUserCourseDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
    }

    public class UpdateUserCourseProgressDto
    {
        public int? CurrentUnitId { get; set; }
        public int? CurrentLessonId { get; set; }
        public int? ExperienceGained { get; set; }
    }

    public class UserCourseDetailDto
    {
        public int UserCourseId { get; set; }
        public int UserId { get; set; }
        public CourseDto Course { get; set; }
        public UnitDto? CurrentUnit { get; set; }
        public LessonDto? CurrentLesson { get; set; }
        public int TotalExperienceEarned { get; set; }
        public bool IsCompleted { get; set; }
        public int ProgressPercentage { get; set; }
    }
}