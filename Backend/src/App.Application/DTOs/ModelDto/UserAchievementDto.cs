// UserAchievementDTOs.cs
namespace src.Application.DTOs
{
    public class UserAchievementDto
    {
        public int UserAchievementId { get; set; }
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public string AchievementName { get; set; }
        public string Description { get; set; }
        public string? IconUrl { get; set; }
        public DateTime DateEarned { get; set; }
    }

    public class CreateUserAchievementDto
    {
        public int UserId { get; set; }
        public int AchievementId { get; set; }
    }

    public class UserAchievementSummaryDto
    {
        public int TotalAchievements { get; set; }
        public List<UserAchievementDto> RecentAchievements { get; set; }
    }
}