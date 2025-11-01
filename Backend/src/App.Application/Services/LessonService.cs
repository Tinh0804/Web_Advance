using src.Application.DTOs;
using src.Application.Interfaces.Services;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IRepository<Lesson> _unitRepository;

        public LessonService(ILessonRepository lessonRepository, IRepository<Lesson> unitRepository)
        {
            _lessonRepository = lessonRepository;
            _unitRepository = unitRepository;
        }

        public async Task<LessonDto?> GetLessonByIdAsync(int id)
        {
            var lesson = await _lessonRepository.GetByIdAsync(id);
            return lesson == null ? null : MapToDto(lesson);
        }

        public async Task<IEnumerable<LessonDto>> GetAllLessonsAsync()
        {
            var lessons = await _lessonRepository.GetAllAsync();
            return lessons.Select(MapToDto);
        }

        public async Task<IEnumerable<LessonDto>> GetLessonsByUnitIdAsync(int unitId)
        {
            var lessons = await _lessonRepository.GetLessonsByUnitIdAsync(unitId);
            return lessons.Select(MapToDto);
        }

        public async Task<LessonDetailDto?> GetLessonWithExercisesAsync(int lessonId)
        {
            var lesson = await _lessonRepository.GetLessonWithExercisesAsync(lessonId);
            return lesson == null ? null : MapToDetailDto(lesson);
        }

        public async Task<LessonDto> CreateLessonAsync(CreateLessonDto createLessonDto)
        {
            var unitExists = await _unitRepository.ExistsAsync(createLessonDto.UnitId);
            if (!unitExists)
            {
                throw new ArgumentException("Unit not found");
            }

            var lesson = new Lesson
            {
                UnitId = createLessonDto.UnitId,
                LessonName = createLessonDto.LessonName,
                OrderIndex = createLessonDto.OrderIndex,
                // LessonType = createLessonDto.LessonType,
                ExperienceReward = createLessonDto.ExperienceReward,
                UnlockRequired = createLessonDto.UnlockRequired
            };

            var createdLesson = await _lessonRepository.AddAsync(lesson);
            return MapToDto(createdLesson);
        }

        public async Task<bool> UpdateLessonAsync(int id, UpdateLessonDto updateLessonDto)
        {
            var lesson = await _lessonRepository.GetByIdAsync(id);
            if (lesson == null) return false;

            if (updateLessonDto.LessonName != null)
                lesson.LessonName = updateLessonDto.LessonName;

            if (updateLessonDto.OrderIndex.HasValue)
                lesson.OrderIndex = updateLessonDto.OrderIndex.Value;

            // if (updateLessonDto.LessonType != null)
            //     lesson.LessonType = updateLessonDto.LessonType;

            if (updateLessonDto.ExperienceReward.HasValue)
                lesson.ExperienceReward = updateLessonDto.ExperienceReward.Value;

            if (updateLessonDto.UnlockRequired.HasValue)
                lesson.UnlockRequired = updateLessonDto.UnlockRequired.Value;

            await _lessonRepository.UpdateAsync(lesson);
            return true;
        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
            var exists = await _lessonRepository.ExistsAsync(id);
            if (!exists) return false;

            await _lessonRepository.DeleteAsync(id);
            return true;
        }

        public async Task<LessonDto?> GetNextLessonAsync(int currentLessonId)
        {
            var nextLesson = await _lessonRepository.GetNextLessonAsync(currentLessonId);
            return nextLesson == null ? null : MapToDto(nextLesson);
        }

        public async Task<bool> IsLessonAccessibleAsync(int lessonId, int userId)
        {
            return await _lessonRepository.IsLessonUnlockedAsync(lessonId, userId);
        }

        private LessonDto MapToDto(Lesson lesson)
        {
            return new LessonDto
            {
                LessonId = lesson.LessonId,
                UnitId = lesson.UnitId,
                LessonName = lesson.LessonName,
                OrderIndex = (int)lesson.OrderIndex,
                // LessonType = lesson.LessonType,
                ExperienceReward = lesson.ExperienceReward,
                UnlockRequired = lesson.UnlockRequired,
                UnitName = lesson.Unit?.UnitName
            };
        }

        private LessonDetailDto MapToDetailDto(Lesson lesson)
        {
            return new LessonDetailDto
            {
                LessonId = lesson.LessonId,
                UnitId = lesson.UnitId,
                LessonName = lesson.LessonName,
                OrderIndex = (int)lesson.OrderIndex,
                // LessonType = lesson.LessonType,
                ExperienceReward = lesson.ExperienceReward,
                UnlockRequired = lesson.UnlockRequired,
                UnitName = lesson.Unit?.UnitName,
                Exercises = lesson.Exercises?.Select(e => new ExerciseDto
                {
                    ExerciseId = e.ExerciseId,
                    Question = e.Question,
                    ExerciseType = e.ExerciseType
                }).ToList()
            };
        }
    }
}