namespace src.Application.DTOs
{
    public class ExerciseDto
    {
        public int ExerciseId { get; set; }
        public int LessonId { get; set; }
        public int OrderIndex { get; set; }
        public string ExerciseType { get; set; }
        public string Question { get; set; }
        public string? AudioFile { get; set; }
        public int? ExperienceReward { get; set; }
        public List<string>? Options { get; set; }
    }

    public class CreateExerciseDto
    {
        public int LessonId { get; set; }
        public int OrderIndex { get; set; }
        public string ExerciseType { get; set; }
        public string Question { get; set; }
        public string? AudioFile { get; set; }
        public string CorrectAnswer { get; set; }
        public int? ExperienceReward { get; set; }
    }

    public class SubmitAnswerDto
    {
        public int ExerciseId { get; set; }
        public int UserId { get; set; }
        public string UserAnswer { get; set; }
    }

    public class ExerciseResultDto
    {
        public bool IsCorrect { get; set; }
        public string CorrectAnswer { get; set; }
        public int ExperienceEarned { get; set; }
        public int TotalExperience { get; set; }
    }
}
