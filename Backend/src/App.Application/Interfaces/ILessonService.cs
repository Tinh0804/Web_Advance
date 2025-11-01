using src.Application.DTOs;

namespace src.Application.Interfaces.Services
{
    public interface ILessonService
    {
        Task<LessonDto?> GetLessonByIdAsync(int id);
        Task<IEnumerable<LessonDto>> GetAllLessonsAsync();
        Task<IEnumerable<LessonDto>> GetLessonsByUnitIdAsync(int unitId);
        Task<LessonDetailDto?> GetLessonWithExercisesAsync(int lessonId);
        Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto);
        Task<bool> UpdateLessonAsync(int id, UpdateLessonDto updateLessonDto);
        Task<bool> DeleteLessonAsync(int id);
        Task<LessonDto?> GetNextLessonAsync(int currentLessonId);
        Task<bool> IsLessonAccessibleAsync(int lessonId, int userId);
    }
}