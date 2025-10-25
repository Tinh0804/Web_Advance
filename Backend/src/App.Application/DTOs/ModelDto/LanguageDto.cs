namespace src.Application.DTOs
{
    public class LanguageDto
    {
        public int LanguageId { get; set; }
        public string LanguageName { get; set; }
        public string LanguageCode { get; set; }
        public string? FlagIcon { get; set; }
        public bool IsSupported { get; set; }
        public int TotalCourses { get; set; }
    }

    public class CreateLanguageDto
    {
        public string LanguageName { get; set; }
        public string LanguageCode { get; set; }
        public string? FlagIcon { get; set; }
        public bool IsSupported { get; set; } = true;
    }
}