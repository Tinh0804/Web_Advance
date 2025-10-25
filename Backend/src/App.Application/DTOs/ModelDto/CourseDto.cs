namespace src.Application.DTOs
{
    public class CourseDto
    {
        public int CourseId { get; set; }
        public string? CourseName { get; set; }
        public int FromLanguageId { get; set; }
        public string FromLanguageName { get; set; }
        public int ToLanguageId { get; set; }
        public string ToLanguageName { get; set; }
        public string DifficultyLevel { get; set; }
        public string? CourseIcon { get; set; }
        public int TotalUnits { get; set; }
        public int CompletedUnits { get; set; }
        public double ProgressPercentage { get; set; }
    }

    public class CreateCourseDto
    {
        public string CourseName { get; set; }
        public int FromLanguageId { get; set; }
        public int ToLanguageId { get; set; }
        public string DifficultyLevel { get; set; }
        public string? CourseIcon { get; set; }
    }

    public class EnrollCourseDto
    {
        public int UserId { get; set; }
        public int CourseId { get; set; }
    }
}
