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
        }
    }
}