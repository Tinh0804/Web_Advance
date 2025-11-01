// UnitService.cs
using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class UnitService : IUnitService
    {
        private readonly IUnitRepository _unitRepository;
        private readonly ICourseRepository _courseRepository;

        public UnitService(IUnitRepository unitRepository, ICourseRepository courseRepository)
        {
            _unitRepository = unitRepository;
            _courseRepository = courseRepository;
        }

        public async Task<IEnumerable<UnitDto>> GetAllUnitsAsync()
        {
            var units = await _unitRepository.GetAllAsync();
            return units.Select(MapToDto);
        }

        public async Task<UnitDetailDto?> GetUnitByIdAsync(int id)
        {
            var unit = await _unitRepository.GetUnitWithLessonsAsync(id);
            if (unit == null) return null;

            return new UnitDetailDto
            {
                UnitId = unit.UnitId,
                UnitName = unit.UnitName,
                OrderIndex = unit.OrderIndex,
                IsLocked = unit.UnlockRequired,
                Lessons = unit.Lessons?.Select(l => new LessonDto
                {
                    LessonId = l.LessonId,
                    LessonName = l.LessonName,
                    OrderIndex = (int)l.OrderIndex
                }).ToList() ?? new List<LessonDto>()
            };
        }

        public async Task<IEnumerable<UnitDto>> GetUnitsByCourseIdAsync(int courseId)
        {
            var units = await _unitRepository.GetUnitsByCourseIdAsync(courseId);
            return units.Select(MapToDto);
        }

        public async Task<UnitDto> CreateUnitAsync(CreateUnitDto dto)
        {
            var courseExists = await _courseRepository.ExistsAsync(dto.CourseId);
            if (!courseExists)
                throw new ArgumentException("Course not found");

            var unit = new Unit
            {
                CourseId = dto.CourseId,
                UnitName = dto.UnitName,
                OrderIndex = dto.OrderIndex,
                UnlockRequired = dto.IsLocked
            };

            var createdUnit = await _unitRepository.AddAsync(unit);
            return MapToDto(createdUnit);
        }

        public async Task<bool> UpdateUnitAsync(int id, UpdateUnitDto dto)
        {
            var unit = await _unitRepository.GetByIdAsync(id);
            if (unit == null) return false;

            if (dto.UnitName != null) unit.UnitName = dto.UnitName;
            if (dto.OrderIndex.HasValue) unit.OrderIndex = dto.OrderIndex.Value;
            if (dto.IsLocked.HasValue) unit.UnlockRequired = dto.IsLocked.Value;

            await _unitRepository.UpdateAsync(unit);
            return true;
        }

        public async Task<bool> DeleteUnitAsync(int id)
        {
            if (!await _unitRepository.ExistsAsync(id))
                return false;

            await _unitRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> UnlockUnitForUserAsync(int unitId, int userId)
        {
            return await _unitRepository.IsUnitUnlockedForUserAsync(unitId, userId);
        }

        public async Task<UnitDto?> GetNextUnitAsync(int courseId, int currentOrderIndex)
        {
            var nextUnit = await _unitRepository.GetNextUnitAsync(courseId, currentOrderIndex);
            return nextUnit != null ? MapToDto(nextUnit) : null;
        }

        private UnitDto MapToDto(Unit unit)
        {
            return new UnitDto
            {
                UnitId = unit.UnitId,
                CourseId = unit.CourseId,
                UnitName = unit.UnitName,
                OrderIndex = unit.OrderIndex,
                IsLocked = unit.UnlockRequired,
                TotalLessons = unit.Lessons?.Count ?? 0,
                CompletedLessons = 0 // Cần implement logic đếm lessons hoàn thành
            };
        }
    }
}