// UnitDTOs.cs
namespace src.Application.DTOs
{
    public class UnitDto
    {
        public int UnitId { get; set; }
        public int CourseId { get; set; }
        public string UnitName { get; set; }
        public int OrderIndex { get; set; }
        public string? Description { get; set; }
        public bool IsLocked { get; set; }
        public int TotalLessons { get; set; }
        public int CompletedLessons { get; set; }
    }

    public class CreateUnitDto
    {
        public int CourseId { get; set; }
        public string UnitName { get; set; }
        public int OrderIndex { get; set; }
        public string? Description { get; set; }
        public bool IsLocked { get; set; }
    }

    public class UpdateUnitDto
    {
        public string? UnitName { get; set; }
        public int? OrderIndex { get; set; }
        public string? Description { get; set; }
        public bool? IsLocked { get; set; }
    }

    public class UnitDetailDto
    {
        public int UnitId { get; set; }
        public string UnitName { get; set; }
        public string? Description { get; set; }
        public int OrderIndex { get; set; }
        public bool IsLocked { get; set; }
        public List<LessonDto> Lessons { get; set; }
    }
}