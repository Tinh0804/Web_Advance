using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("LESSONS")]
    public class Lesson
    {
         [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int LessonId { get; set; } 
        public int UnitId { get; set; }
        public string LessonName { get; set; }
        public int? OrderIndex { get; set; }
        // public string LessonType { get; set; } = "vocabulary";
        public int ExperienceReward { get; set; } = 10;
        public bool UnlockRequired { get; set; } = false;

        public virtual Unit Unit { get; set; }
        public virtual ICollection<Exercise>? Exercises { get; set; }
    }
}