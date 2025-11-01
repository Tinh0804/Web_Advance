// UserCourseRepository.cs
using Microsoft.EntityFrameworkCore;
using src.Domain.Entities;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class UserCourseRepository : IUserCourseRepository
    {
        private readonly ApplicationDbContext _context;

        public UserCourseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserCourse?> GetByIdAsync(int id)
        {
            return await _context.UserCourses.FindAsync(id);
        }

        public async Task<IEnumerable<UserCourse>> GetAllAsync()
        {
            return await _context.UserCourses.ToListAsync();
        }

        public async Task<UserCourse> AddAsync(UserCourse entity)
        {
            await _context.UserCourses.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task UpdateAsync(UserCourse entity)
        {
            _context.UserCourses.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var userCourse = await GetByIdAsync(id);
            if (userCourse != null)
            {
                _context.UserCourses.Remove(userCourse);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.UserCourses.AnyAsync(uc => uc.UserCourseId == id);
        }

        public async Task<IEnumerable<UserCourse>> GetUserCoursesAsync(int userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .Include(uc => uc.Course)
                .Include(uc => uc.CurrentUnit)
                .Include(uc => uc.CurrentLesson)
                .ToListAsync();
        }

        public async Task<UserCourse?> GetUserCourseAsync(int userId, int courseId)
        {
            return await _context.UserCourses
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);
        }

        public async Task<UserCourse?> GetUserCourseWithDetailsAsync(int userId, int courseId)
        {
            return await _context.UserCourses
                .Include(uc => uc.Course)
                .Include(uc => uc.CurrentUnit)
                    .ThenInclude(u => u.Lessons)
                .Include(uc => uc.CurrentLesson)
                .Include(uc => uc.UserProfile)
                .FirstOrDefaultAsync(uc => uc.UserId == userId && uc.CourseId == courseId);
        }

        public async Task<IEnumerable<UserCourse>> GetCompletedCoursesAsync(int userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId && uc.IsCompleted)
                .Include(uc => uc.Course)
                .ToListAsync();
        }

        public async Task<int> GetTotalExperienceByUserAsync(int userId)
        {
            return await _context.UserCourses
                .Where(uc => uc.UserId == userId)
                .SumAsync(uc => uc.TotalExperienceEarned ?? 0);
        }
    }
}