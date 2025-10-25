using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("USER_ACHIEMENTS")]
    public class UserAchievement
    {
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int UserAchievementId { get; set; } 
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public DateTime DateEarned { get; set; } = DateTime.UtcNow;

        public virtual UserProfile UserProfile { get; set; }
        public virtual Achievement Achievement { get; set; }
    }
}