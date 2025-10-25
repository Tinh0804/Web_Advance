using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("COURSES")]
    public class Course
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CourseId { get; set; }
        public string? CourseName { get; set; }

        [ForeignKey(nameof(FromLanguage))]
        public int FromLanguageId { get; set; }

        [ForeignKey(nameof(ToLanguage))]
        public int ToLanguageId { get; set; }

        public string DifficultyLevel { get; set; } = "beginner";
        public string? CourseIcon { get; set; }

        // Navigation
        public virtual Language FromLanguage { get; set; } = null!;
        public virtual Language ToLanguage { get; set; } = null!;
        public virtual ICollection<Unit>? Units { get; set; }
        public virtual ICollection<UserCourse>? UserCourses { get; set; }
    }
}
