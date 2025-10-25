using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("LANGUAGES")]
    public class Language
    {
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int LanguageId { get; set; } 
        public string LanguageName { get; set; }
        public string LanguageCode { get; set; }
        public string? FlagIcon { get; set; }
        public bool IsSupported { get; set; } = true;

        // Navigation
         public ICollection<UserProfile>? UserProfiles { get; set; }
        public ICollection<Course>? FromCourses { get; set; }
        public ICollection<Course>? ToCourses { get; set; }
        public ICollection<Word>? Words { get; set; }
    }
}