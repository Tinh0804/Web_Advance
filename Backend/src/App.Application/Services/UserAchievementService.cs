// UserAchievementService.cs
using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class UserAchievementService : IUserAchievementService
    {
        private readonly IUserAchievementRepository _userAchievementRepository;
        private readonly IAchievementRepository _achievementRepository;
        private readonly IUserProfileRepository _userProfileRepository;

        public UserAchievementService(
            IUserAchievementRepository userAchievementRepository,
            IAchievementRepository achievementRepository,
            IUserProfileRepository userProfileRepository)
        {
            _userAchievementRepository = userAchievementRepository;
            _achievementRepository = achievementRepository;
            _userProfileRepository = userProfileRepository;
        }

        public async Task<IEnumerable<UserAchievementDto>> GetUserAchievementsAsync(int userId)
        {
            var achievements = await _userAchievementRepository.GetUserAchievementsAsync(userId);
            return achievements.Select(MapToDto);
        }

        public async Task<UserAchievementDto?> GetUserAchievementByIdAsync(int id)
        {
            var achievement = await _userAchievementRepository.GetByIdAsync(id);
            return achievement != null ? MapToDto(achievement) : null;
        }

        public async Task<UserAchievementDto> AwardAchievementAsync(CreateUserAchievementDto dto)
        {
            // Kiểm tra user và achievement tồn tại
            var userExists = await _userProfileRepository.ExistsAsync(dto.UserId);
            if (!userExists)
                throw new ArgumentException("User not found");

            var achievementExists = await _achievementRepository.ExistsAsync(dto.AchievementId);
            if (!achievementExists)
                throw new ArgumentException("Achievement not found");

            // Kiểm tra user đã có achievement này chưa
            var hasAchievement = await _userAchievementRepository
                .HasUserEarnedAchievementAsync(dto.UserId, dto.AchievementId);
            
            if (hasAchievement)
                throw new InvalidOperationException("User already has this achievement");

            var userAchievement = new UserAchievement
            {
                UserId = dto.UserId,
                AchievementId = dto.AchievementId,
                DateEarned = DateTime.UtcNow
            };

            var created = await _userAchievementRepository.AddAsync(userAchievement);
            var achievement = await _achievementRepository.GetByIdAsync(dto.AchievementId);
            
            return new UserAchievementDto
            {
                UserAchievementId = created.UserAchievementId,
                UserId = created.UserId,
                AchievementId = created.AchievementId,
                AchievementName = achievement.AchievementName,
                // Description = achievement.Description,
                // IconUrl = achievement.IconUrl,
                DateEarned = created.DateEarned
            };
        }

        public async Task<bool> DeleteUserAchievementAsync(int id)
        {
            if (!await _userAchievementRepository.ExistsAsync(id))
                return false;

            await _userAchievementRepository.DeleteAsync(id);
            return true;
        }

        public async Task<UserAchievementSummaryDto> GetUserAchievementSummaryAsync(int userId)
        {
            var achievements = await _userAchievementRepository.GetUserAchievementsAsync(userId);
            var totalCount = await _userAchievementRepository.GetTotalAchievementsCountAsync(userId);

            return new UserAchievementSummaryDto
            {
                TotalAchievements = totalCount,
                RecentAchievements = achievements
                    .OrderByDescending(a => a.DateEarned)
                    .Take(5)
                    .Select(MapToDto)
                    .ToList()
            };
        }

        public async Task<bool> CheckAndAwardAchievementsAsync(int userId)
        {
            // Logic tự động kiểm tra và trao achievements
            // Ví dụ: hoàn thành 10 bài học, streak 7 ngày, etc.
            // Đây là placeholder logic, cần implement theo business rules
            
            var allAchievements = await _achievementRepository.GetAllAsync();
            bool awarded = false;

            foreach (var achievement in allAchievements)
            {
                var hasAchievement = await _userAchievementRepository
                    .HasUserEarnedAchievementAsync(userId, achievement.AchievementId);

                if (!hasAchievement)
                {
                    // Kiểm tra điều kiện đạt achievement
                    bool meetsRequirement = await CheckAchievementRequirement(userId, achievement);
                    
                    if (meetsRequirement)
                    {
                        await AwardAchievementAsync(new CreateUserAchievementDto
                        {
                            UserId = userId,
                            AchievementId = achievement.AchievementId
                        });
                        awarded = true;
                    }
                }
            }

            return awarded;
        }

        private async Task<bool> CheckAchievementRequirement(int userId, Achievement achievement)
        {
            // Implement logic kiểm tra điều kiện
            // Ví dụ: streak days, completed lessons, total XP, etc.
            return false; // Placeholder
        }

        private UserAchievementDto MapToDto(UserAchievement userAchievement)
        {
            return new UserAchievementDto
            {
                UserAchievementId = userAchievement.UserAchievementId,
                UserId = userAchievement.UserId,
                AchievementId = userAchievement.AchievementId,
                AchievementName = userAchievement.Achievement?.AchievementName ?? "",
                // Description = userAchievement.Achievement?.Description ?? "",
                // IconUrl = userAchievement.Achievement?.IconUrl,
                DateEarned = userAchievement.DateEarned
            };
        }
    }
}