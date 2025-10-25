using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("USER_COURSES")]
    public class UserCourse
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserCourseId { get; set; }
        public int UserId { get; set; }
        public int CourseId { get; set; }
        public int? CurrentUnitId { get; set; }
        public int? CurrentLessonId { get; set; }
        public int? TotalExperienceEarned { get; set; }
        public bool IsCompleted { get; set; } = false;

        public virtual UserProfile UserProfile { get; set; }
        public virtual Course Course { get; set; }
        public virtual Unit? CurrentUnit { get; set; }
        public virtual Lesson? CurrentLesson { get; set; }
    }
}
