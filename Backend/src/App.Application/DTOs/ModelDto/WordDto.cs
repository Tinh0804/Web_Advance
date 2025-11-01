// WordDTOs.cs
namespace src.Application.DTOs
{
    public class WordDto
    {
        public int WordId { get; set; }
        public int LanguageId { get; set; }
        public int LessonId { get; set; }
        public string WordName { get; set; }
        public string? Translation { get; set; }
        public string? Pronunciation { get; set; }
        public string WordType { get; set; }
        public string? AudioFile { get; set; }
        public string? ImageUrl { get; set; }
        public string? ExampleSentence { get; set; }
    }

    public class CreateWordDto
    {
        public int LanguageId { get; set; }
        public int LessonId { get; set; }
        public string WordName { get; set; }
        public string? Translation { get; set; }
        public string? Pronunciation { get; set; }
        public string WordType { get; set; }
        public string? AudioFile { get; set; }
        public string? ImageUrl { get; set; }
        public string? ExampleSentence { get; set; }
    }

    public class UpdateWordDto
    {
        public string? WordName { get; set; }
        public string? Translation { get; set; }
        public string? Pronunciation { get; set; }
        public string? WordType { get; set; }
        public string? AudioFile { get; set; }
        public string? ImageUrl { get; set; }
        public string? ExampleSentence { get; set; }
    }

    public class WordDetailDto : WordDto
    {
        public string LanguageName { get; set; }
        public string LessonName { get; set; }
    }
}