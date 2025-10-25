using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using src.Domain.Enums;

namespace src.Domain.Entities
{
    [Table("EXERCISES")]
   public class Exercise
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ExerciseId { get; set; }
        public int LessonId { get; set; }
        public int OrderIndex { get; set; }
        public string ExerciseType { get; set; } = "multiple_choice";
        public string Question { get; set; }
        public string? AudioFile { get; set; }
        public string CorrectAnswer { get; set; }
        public int? ExperienceReward { get; set; }

        public virtual Lesson Lesson { get; set; }
    }

}