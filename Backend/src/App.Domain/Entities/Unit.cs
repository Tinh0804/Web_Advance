using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace src.Domain.Entities
{
    [Table("UNITS")]
    public class Unit
    {
       [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int UnitId { get; set; }
        public int CourseId { get; set; }
        public string UnitName { get; set; }
        public int OrderIndex { get; set; }
        public string? Description { get; set; }
        public bool IsLocked { get; set; } = false;

        public Course Course { get; set; }
        public ICollection<Lesson>? Lessons { get; set; }
    }
}