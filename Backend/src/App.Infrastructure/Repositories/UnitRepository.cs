// UnitRepository.cs
using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class UnitRepository : IUnitRepository
    {
        private readonly ApplicationDbContext _context;

        public UnitRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit?> GetByIdAsync(int id)
        {
            return await _context.Units.FindAsync(id);
        }

        public async Task<IEnumerable<Unit>> GetAllAsync()
        {
            return await _context.Units
                .OrderBy(u => u.OrderIndex)
                .ToListAsync();
        }

        public async Task<Unit> AddAsync(Unit entity)
        {
            await _context.Units.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(Unit entity)
        {
            _context.Units.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var unit = await GetByIdAsync(id);
            if (unit != null)
            {
                _context.Units.Remove(unit);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Units.AnyAsync(u => u.UnitId == id);
        }

        public async Task<IEnumerable<Unit>> GetUnitsByCourseIdAsync(int courseId)
        {
            return await _context.Units
                .Where(u => u.CourseId == courseId)
                .OrderBy(u => u.OrderIndex)
                .Include(u => u.Lessons)
                .ToListAsync();
        }

        public async Task<Unit?> GetUnitWithLessonsAsync(int unitId)
        {
            return await _context.Units
                .Include(u => u.Lessons)
                .Include(u => u.Course)
                .FirstOrDefaultAsync(u => u.UnitId == unitId);
        }

        public async Task<Unit?> GetNextUnitAsync(int courseId, int currentOrderIndex)
        {
            return await _context.Units
                .Where(u => u.CourseId == courseId && u.OrderIndex > currentOrderIndex)
                .OrderBy(u => u.OrderIndex)
                .FirstOrDefaultAsync();
        }

        public async Task<bool> IsUnitUnlockedForUserAsync(int unitId, int userId)
        {
            var unit = await _context.Units.FindAsync(unitId);
            if (unit == null) return false;

            // Nếu unit không bị khóa
            if (!unit.UnlockRequired) return true;

            // Kiểm tra xem user đã hoàn thành unit trước đó chưa
            var previousUnit = await _context.Units
                .Where(u => u.CourseId == unit.CourseId && u.OrderIndex < unit.OrderIndex)
                .OrderByDescending(u => u.OrderIndex)
                .FirstOrDefaultAsync();

            if (previousUnit == null) return true;

            // Kiểm tra progress của user ở unit trước
            var userCourse = await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == unit.CourseId);

            return userCourse?.CurrentUnitId >= previousUnit.UnitId;
        }
    }
}