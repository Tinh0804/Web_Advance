namespace src.Application.DTOs.ModelDto
{
    public class UserProfileDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Avatar { get; set; }
        public int CurrentStreak { get; set; }
        public int LongestStreak { get; set; }
        public int TotalXP { get; set; }
        public int Hearts { get; set; }
        public List<UserLanguageDto> Languages { get; set; } = new();
        public List<AchievementDto> RecentAchievements { get; set; } = new();
    }

    public class UserLanguageDto
    {
        public int LanguageId { get; set; }
        public string LanguageName { get; set; } = string.Empty;
        public string Flag { get; set; } = string.Empty;
        public bool IsCurrent { get; set; }
        public int Level { get; set; }
        public int XP { get; set; }
        public int Progress { get; set; } // Percentage
    }

    public class AchievementDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string IconUrl { get; set; } = string.Empty;
        public DateTime? EarnedAt { get; set; }
        public bool IsUnlocked { get; set; }
    }
}