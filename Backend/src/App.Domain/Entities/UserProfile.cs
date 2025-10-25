using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace src.Domain.Entities
{
    [Table("USERS")]
     public class UserProfile
    {
               [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        [Column("userId")]
        public int UserId { get; set; } 
         [Column("phoneNumber")]
        public string PhoneNumber { get; set; }
         [Column("fullName")]
        public string? FullName { get; set; }

        [Column("avatar")]
        public string? Avatar { get; set; }

        [Column("dateOfBirth")]
        public DateTime? DateOfBirth { get; set; } = DateTime.Now;
        
        // public string? Avatar { get; set; }

             [Column("nativeLanguageId")]
        public int? NativeLanguageId { get; set; }
        [Column("totalExperience")]

        public int TotalExperience { get; set; } = 0;

        [Column("currentStreak")]
        public int CurrentStreak { get; set; } = 0;
        
        [Column("longestStreak")]
        public int LongestStreak { get; set; } = 0;
        [Column("hearts")]
        public int Hearts { get; set; } = 5;

        [Column("subscriptionType")]
        public string SubscriptionType { get; set; } = "free";
        
        [Column("accountId")]
        public string UserAccountId { get; set; }

        // Navigation
         public virtual UserAccount? UserAccount { get; set; }
        [ForeignKey(nameof(NativeLanguageId))]
         public Language? NativeLanguage { get; set; }
        public ICollection<UserCourse>? UserCourses { get; set; }
        public ICollection<UserAchievement>? UserAchievements { get; set; }
        public ICollection<Goal>? Goals { get; set; }
    }
}
