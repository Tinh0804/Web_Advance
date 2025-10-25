namespace src.Application.DTOs
{
    public class AchievementDto
    {
        public int AchievementId { get; set; }
        public string AchievementName { get; set; }
        public string AchievementType { get; set; }
        public int RequiredValue { get; set; }
        public string? BadgeIcon { get; set; }
        public int ExperienceReward { get; set; }
        public bool IsUnlocked { get; set; }
        public DateTime? UnlockedDate { get; set; }
    }

    public class CreateAchievementDto
    {
        public string AchievementName { get; set; }
        public string AchievementType { get; set; }
        public int RequiredValue { get; set; }
        public string? BadgeIcon { get; set; }
        public int ExperienceReward { get; set; }
    }
}