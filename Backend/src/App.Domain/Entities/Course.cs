using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using src.Domain.Enums;

namespace src.Domain.Entities
{
    [Table("COURSES")]
    public class Course
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CourseId { get; set; }

        [Required]
        [StringLength(100)]
        public string CourseName { get; set; } = null!;

        public int FromLanguageId { get; set; }

        public int ToLanguageId { get; set; }

        [Required]
        public string DifficultyLevel { get; set; } = DifficultyLevels.Beginner;

        [StringLength(255)]
        public string? CourseIcon { get; set; }

        [ForeignKey(nameof(FromLanguageId))]
        public virtual Language FromLanguage { get; set; } = null!;
        
          [ForeignKey(nameof(ToLanguageId))]
        public virtual Language ToLanguage { get; set; } = null!;
        public virtual ICollection<Unit> Units { get; set; } = new HashSet<Unit>();
        public virtual ICollection<UserCourse> UserCourses { get; set; } = new HashSet<UserCourse>();
    }
}
