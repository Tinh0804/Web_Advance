using Microsoft.EntityFrameworkCore.Storage;
using src.Domain.Interfaces;
using src.Infrastructure.Data;

namespace src.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        public IAchievementRepository Achievements { get; }
        public ICourseRepository Courses { get; }
        public IExerciseRepository Exercises { get; }
        public IGoalRepository Goals { get; }
        public ILanguageRepository Languages { get; }

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Achievements = new AchievementRepository(context);
            Courses = new CourseRepository(context);
            Exercises = new ExerciseRepository(context);
            Goals = new GoalRepository(context);
            Languages = new LanguageRepository(context);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}