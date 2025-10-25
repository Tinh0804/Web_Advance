using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("WORDS")]
     public class Word
    {
               [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int WordId { get; set; }
        public int LanguageId { get; set; }
        [Column("Word")]
        public string? WordName { get; set; }
        public string? Translation { get; set; }
        public string? Pronunciation { get; set; }
        public string WordType { get; set; } = "noun";
        public string? AudioFile { get; set; }
        public string? ImageUrl { get; set; }
        public string? ExampleSentence { get; set; }

        public virtual Language Language { get; set; }
        public virtual ICollection<LessonWord>? LessonWords { get; set; }
    }
}