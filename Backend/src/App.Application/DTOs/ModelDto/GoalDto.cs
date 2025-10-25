namespace src.Application.DTOs
{
    public class GoalDto
    {
        public int GoalId { get; set; }
        public int UserId { get; set; }
        public int TargetValue { get; set; }
        public int CurrentValue { get; set; }
        public DateTime? ResetDate { get; set; }
        public double ProgressPercentage { get; set; }
        public bool IsCompleted { get; set; }
    }

    public class CreateGoalDto
    {
        public int UserId { get; set; }
        public int TargetValue { get; set; }
    }

    public class UpdateGoalProgressDto
    {
        public int UserId { get; set; }
        public int Progress { get; set; }
    }
}