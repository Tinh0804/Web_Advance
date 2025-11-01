using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ExerciseService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<ExerciseDto>> GetExercisesByLessonAsync(int lessonId)
        {
            var exercises = await _unitOfWork.Exercises.GetByLessonIdAsync(lessonId);
            return exercises.Select(MapToDto);
        }

        public async Task<ExerciseDto?> GetExerciseByIdAsync(int id)
        {
            var exercise = await _unitOfWork.Exercises.GetByIdAsync(id);
            return exercise != null ? MapToDto(exercise) : null;
        }

        public async Task<ExerciseDto?> GetNextExerciseAsync(int lessonId, int currentOrderIndex)
        {
            var exercise = await _unitOfWork.Exercises.GetNextExerciseAsync(lessonId, currentOrderIndex);
            return exercise != null ? MapToDto(exercise) : null;
        }

        public async Task<ExerciseDto> CreateExerciseAsync(CreateExerciseDto dto)
        {
            var exercise = new Exercise
            {
                LessonId = dto.LessonId,
                OrderIndex = dto.OrderIndex,
                ExerciseType = dto.ExerciseType,
                Question = dto.Question,
                AudioFile = dto.AudioFile,
                CorrectAnswer = dto.CorrectAnswer,
                ExperienceReward = dto.ExperienceReward ?? 0
            };

            await _unitOfWork.Exercises.AddAsync(exercise);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(exercise);
        }

        public async Task<ExerciseResultDto> SubmitAnswerAsync(SubmitAnswerDto dto)
        {
            var exercise = await _unitOfWork.Exercises.GetByIdAsync(dto.ExerciseId);
            if (exercise == null)
            {
                return new ExerciseResultDto
                {
                    IsCorrect = false,
                    CorrectAnswer = "",
                    ExperienceEarned = 0,
                    TotalExperience = 0
                };
            }

            var isCorrect = exercise.CorrectAnswer.Trim().ToLower() == dto.UserAnswer.Trim().ToLower();
            var expEarned = isCorrect ? (exercise.ExperienceReward ) : 0;

            // Here you would update user progress, experience, etc.
            // This requires additional logic with UserProfile repository

            return new ExerciseResultDto
            {
                IsCorrect = isCorrect,
                CorrectAnswer = exercise.CorrectAnswer,
                ExperienceEarned = expEarned,
                TotalExperience = expEarned
            };
        }

        public async Task<bool> UpdateExerciseAsync(int id, CreateExerciseDto dto)
        {
            var exercise = await _unitOfWork.Exercises.GetByIdAsync(id);
            if (exercise == null) return false;

            exercise.LessonId = dto.LessonId;
            exercise.OrderIndex = dto.OrderIndex;
            exercise.ExerciseType = dto.ExerciseType;
            exercise.Question = dto.Question;
            exercise.AudioFile = dto.AudioFile;
            exercise.CorrectAnswer = dto.CorrectAnswer;
            exercise.ExperienceReward = (int)dto.ExperienceReward;

            await _unitOfWork.Exercises.UpdateAsync(exercise);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteExerciseAsync(int id)
        {
            await _unitOfWork.Exercises.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private ExerciseDto MapToDto(Exercise exercise)
        {
            return new ExerciseDto
            {
                ExerciseId = exercise.ExerciseId,
                LessonId = exercise.LessonId,
                OrderIndex = exercise.OrderIndex ?? 0,
                ExerciseType = exercise.ExerciseType,
                Question = exercise.Question,
                AudioFile = exercise.AudioFile,
                ExperienceReward = exercise.ExperienceReward
            };
        }
    }
}
