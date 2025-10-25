using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class AchievementService : IAchievementService
    {
        private readonly IUnitOfWork _unitOfWork;

        public AchievementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<AchievementDto>> GetAllAchievementsAsync()
        {
            var achievements = await _unitOfWork.Achievements.GetAllAsync();
            return achievements.Select(MapToDto);
        }

        public async Task<AchievementDto?> GetAchievementByIdAsync(int id)
        {
            var achievement = await _unitOfWork.Achievements.GetByIdAsync(id);
            return achievement != null ? MapToDto(achievement) : null;
        }

        public async Task<IEnumerable<AchievementDto>> GetAchievementsByTypeAsync(string type)
        {
            var achievements = await _unitOfWork.Achievements.GetByTypeAsync(type);
            return achievements.Select(MapToDto);
        }

        public async Task<IEnumerable<AchievementDto>> GetUserAchievementsAsync(int userId)
        {
            var achievements = await _unitOfWork.Achievements.GetUnlockedByUserAsync(userId);
            return achievements.Select(MapToDto);
        }

        public async Task<AchievementDto> CreateAchievementAsync(CreateAchievementDto dto)
        {
            var achievement = new Achievement
            {
                AchievementName = dto.AchievementName,
                AchievementType = dto.AchievementType,
                RequiredValue = dto.RequiredValue,
                BadgeIcon = dto.BadgeIcon,
                ExperienceReward = dto.ExperienceReward
            };

            await _unitOfWork.Achievements.AddAsync(achievement);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(achievement);
        }

        public async Task<bool> CheckAndUnlockAchievementsAsync(int userId, string type, int value)
        {
            var achievement = await _unitOfWork.Achievements.GetByRequiredValueAsync(type, value);
            if (achievement == null) return false;

            // Logic to unlock achievement for user would go here
            // You'd need UserAchievement repository for this
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAchievementAsync(int id)
        {
            await _unitOfWork.Achievements.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private AchievementDto MapToDto(Achievement achievement)
        {
            return new AchievementDto
            {
                AchievementId = achievement.AchievementId,
                AchievementName = achievement.AchievementName,
                AchievementType = achievement.AchievementType,
                RequiredValue = achievement.RequiredValue,
                BadgeIcon = achievement.BadgeIcon,
                ExperienceReward = achievement.ExperienceReward
            };
        }
    }
}
