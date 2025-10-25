using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IExerciseService
    {
        Task<IEnumerable<ExerciseDto>> GetExercisesByLessonAsync(int lessonId);
        Task<ExerciseDto?> GetExerciseByIdAsync(int id);
        Task<ExerciseDto?> GetNextExerciseAsync(int lessonId, int currentOrderIndex);
        Task<ExerciseDto> CreateExerciseAsync(CreateExerciseDto dto);
        Task<ExerciseResultDto> SubmitAnswerAsync(SubmitAnswerDto dto);
        Task<bool> UpdateExerciseAsync(int id, CreateExerciseDto dto);
        Task<bool> DeleteExerciseAsync(int id);
    }
}