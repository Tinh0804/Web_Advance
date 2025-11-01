using System.ComponentModel.DataAnnotations;

namespace src.Application.DTOs
{
    // Read DTO
    public class LessonDto
    {
        public int LessonId { get; set; }
        public int UnitId { get; set; }
        public string? LessonName { get; set; }
        public int OrderIndex { get; set; }
        public string LessonType { get; set; }
        public int ExperienceReward { get; set; }
        public bool UnlockRequired { get; set; }
        public string? UnitName { get; set; }
    }

    // Detailed DTO with related data
    public class LessonDetailDto
    {
        public int LessonId { get; set; }
        public int UnitId { get; set; }
        public string? LessonName { get; set; }
        public int OrderIndex { get; set; }
        public string LessonType { get; set; }
        public int ExperienceReward { get; set; }
        public bool UnlockRequired { get; set; }
        public string? UnitName { get; set; }
        public List<ExerciseDto>? Exercises { get; set; }
    }

    

    // Create DTO
    public class CreateLessonDto
    {
        [Required]
        public int UnitId { get; set; }

        [Required]
        [StringLength(200)]
        public string LessonName { get; set; } = string.Empty;

        [Required]
        public int OrderIndex { get; set; }

        [Required]
        [StringLength(50)]
        public string LessonType { get; set; } = "vocabulary";

        [Range(0, 1000)]
        public int ExperienceReward { get; set; } = 10;

        public bool UnlockRequired { get; set; } = false;
    }

    // Update DTO
    public class UpdateLessonDto
    {
        [StringLength(200)]
        public string? LessonName { get; set; }

        public int? OrderIndex { get; set; }

        [StringLength(50)]
        public string? LessonType { get; set; }

        [Range(0, 1000)]
        public int? ExperienceReward { get; set; }

        public bool? UnlockRequired { get; set; }
    }
}