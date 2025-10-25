using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("LESSON_WORDS")]
    public class LessonWord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LessonWordId { get; set; }
        public int LessonId { get; set; }
        public int WordId { get; set; }

        public virtual Lesson Lesson { get; set; }
        public virtual Word Word { get; set; }
    }
}