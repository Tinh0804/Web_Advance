using AutoMapper;
using src.Application.DTOs;
using src.Application.DTOs.ModelDto;
using src.Domain.Entities;

namespace src.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserAccount, UserDto>();
            CreateMap<UserProfile, UserProfileDto>();
            CreateMap<Permission, PermissionDto>();
            CreateMap<Unit, UnitDto>()
                .ForMember(dest => dest.TotalLessons, opt => opt.MapFrom(src => src.Lessons != null ? src.Lessons.Count : 0))
                .ForMember(dest => dest.CompletedLessons, opt => opt.Ignore());
            
            CreateMap<CreateUnitDto, Unit>();
            CreateMap<Unit, UnitDetailDto>();

            // Word mappings
            CreateMap<Word, WordDto>();
            CreateMap<CreateWordDto, Word>();
            CreateMap<Word, WordDetailDto>()
                .ForMember(dest => dest.LanguageName, opt => opt.MapFrom(src => src.Language.LanguageName))
                .ForMember(dest => dest.LessonName, opt => opt.MapFrom(src => src.Lesson.LessonName));

            // UserCourse mappings
            CreateMap<UserCourse, UserCourseDto>()
                .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.Course.CourseName))
                .ForMember(dest => dest.ProgressPercentage, opt => opt.Ignore());
            
            CreateMap<CreateUserCourseDto, UserCourse>();
            CreateMap<UserCourse, UserCourseDetailDto>();

            // UserAchievement mappings
            CreateMap<UserAchievement, UserAchievementDto>()
                .ForMember(dest => dest.AchievementName, opt => opt.MapFrom(src => src.Achievement.AchievementName));
                // .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Achievement.Description))
                // .ForMember(dest => dest.IconUrl, opt => opt.MapFrom(src => src.Achievement.IconUrl));
            
            CreateMap<CreateUserAchievementDto, UserAchievement>();
        }
    }
}