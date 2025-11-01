using src.Application.Interfaces;
using src.Infrastructure.Services;
using Microsoft.Extensions.Hosting;
using src.Domain.Interfaces;
using src.Infrastructure.Repositories;
using src.Application.Services;
using src.Application.Interfaces.Services;

namespace src.API.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {

            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPermissionService, PermissionService>();
            services.AddScoped<IUserProfileService, UserProfileService>();
            services.AddScoped<IRefreshTokenService, RefreshTokenService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IRoleService, RoleService>();

            services.AddScoped<IAchievementService, AchievementService>();
            services.AddScoped<ICourseService, CourseService>();
            services.AddScoped<IExerciseService, ExerciseService>();
            services.AddScoped<IGoalService, GoalService>();
            services.AddScoped<ILanguageService, LanguageService>();
            services.AddScoped<ILessonService, LessonService>();
             services.AddScoped<IUnitService, UnitService>();
            services.AddScoped<IUserAchievementService, UserAchievementService>();
            services.AddScoped<IUserCourseService, UserCourseService>();
            services.AddScoped<IWordService, WordService>();



            
            return services;
        }

        public static IServiceCollection AddBackgroundServices(this IServiceCollection services)
        {
            return services;
        }
    }
}