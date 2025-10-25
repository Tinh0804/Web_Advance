using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using src.Domain.Enums;

namespace src.Domain.Entities
{
    [Table("ACHIVEMENTS")]
     public class Achievement
    {
         [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int AchievementId { get; set; } 
        public string AchievementName { get; set; }
        public string AchievementType { get; set; } = "streak";
        public int RequiredValue { get; set; }
        public string? BadgeIcon { get; set; }
        public int ExperienceReward { get; set; } = 0;

        public virtual ICollection<UserAchievement>? UserAchievements { get; set; }
    }
}