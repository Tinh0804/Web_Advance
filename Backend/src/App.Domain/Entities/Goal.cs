using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
     [Table("GOALS")]
   public class Goal
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GoalId { get; set; }
        public int UserId { get; set; }
        public int TargetValue { get; set; }
        public int CurrentValue { get; set; } = 0;
        public DateTime? ResetDate { get; set; } 
        
        public virtual UserProfile UserProfile { get; set; }
    }
}