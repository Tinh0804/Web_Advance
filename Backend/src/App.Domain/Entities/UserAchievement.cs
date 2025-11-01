using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("USER_ACHIEVEMENTS")]
    public class UserAchievement
    {
        [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int UserAchievementId { get; set; } 
        public int UserId { get; set; }
        public int AchievementId { get; set; }
        public DateTime DateEarned { get; set; } = DateTime.UtcNow;

         [ForeignKey("UserId")]
        public virtual UserProfile UserProfile { get; set; }

         [ForeignKey("AchievementId")]
        public virtual Achievement Achievement { get; set; }
    }
}