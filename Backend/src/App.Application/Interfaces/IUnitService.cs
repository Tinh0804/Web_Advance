// IUnitService.cs
using src.Application.DTOs;

namespace src.Application.Interfaces
{
    public interface IUnitService
    {
        Task<IEnumerable<UnitDto>> GetAllUnitsAsync();
        Task<UnitDetailDto?> GetUnitByIdAsync(int id);
        Task<IEnumerable<UnitDto>> GetUnitsByCourseIdAsync(int courseId);
        Task<UnitDto> CreateUnitAsync(CreateUnitDto dto);
        Task<bool> UpdateUnitAsync(int id, UpdateUnitDto dto);
        Task<bool> DeleteUnitAsync(int id);
        Task<bool> UnlockUnitForUserAsync(int unitId, int userId);
        Task<UnitDto?> GetNextUnitAsync(int courseId, int currentOrderIndex);
    }
}