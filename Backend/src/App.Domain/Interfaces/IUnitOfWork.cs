namespace src.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IAchievementRepository Achievements { get; }
        ICourseRepository Courses { get; }
        IExerciseRepository Exercises { get; }
        IGoalRepository Goals { get; }
        ILanguageRepository Languages { get; }
        
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}