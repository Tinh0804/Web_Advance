using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using src.Domain.Interfaces;
using src.Infrastructure.Data;
using src.Infrastructure.Repositories;

namespace src.API.Extensions
{
    public static class RepositoryExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services,IConfiguration configuration)
        {
            // 🔹 Đăng ký Repository chung
            services.AddScoped(typeof(IRepository<>), typeof(BaseRepository<>));

            // 🔹 Đăng ký Repository cụ thể (nếu có)
            services.AddScoped<IUserProfileRepository, UserProfileRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
              // Database Context
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly("src.Infrastructure")));

            // Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Repositories
            services.AddScoped<IAchievementRepository, AchievementRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IExerciseRepository, ExerciseRepository>();
            services.AddScoped<IGoalRepository, GoalRepository>();
            services.AddScoped<ILanguageRepository, LanguageRepository>();

            return services;
        }
    }
}
