using src.Application.DTOs;
using src.Application.Interfaces;
using src.Domain.Entities;
using src.Domain.Interfaces;

namespace src.Application.Services
{
    public class GoalService : IGoalService
    {
        private readonly IUnitOfWork _unitOfWork;

        public GoalService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<GoalDto?> GetUserGoalAsync(int userId)
        {
            var goal = await _unitOfWork.Goals.GetByUserIdAsync(userId);
            return goal != null ? MapToDto(goal) : null;
        }

        public async Task<GoalDto> CreateGoalAsync(CreateGoalDto dto)
        {
            var goal = new Goal
            {
                UserId = dto.UserId,
                TargetValue = dto.TargetValue,
                CurrentValue = 0,
                ResetDate = DateTime.UtcNow.AddDays(1)
            };

            await _unitOfWork.Goals.AddAsync(goal);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(goal);
        }

        public async Task<bool> UpdateGoalProgressAsync(UpdateGoalProgressDto dto)
        {
            var result = await _unitOfWork.Goals.UpdateProgressAsync(dto.UserId, dto.Progress);
            if (result)
            {
                await _unitOfWork.SaveChangesAsync();
            }
            return result;
        }

        public async Task<bool> ResetDailyGoalsAsync()
        {
            var goalsToReset = await _unitOfWork.Goals.GetGoalsNeedingResetAsync();
            
            foreach (var goal in goalsToReset)
            {
                await _unitOfWork.Goals.ResetGoalAsync(goal.GoalId);
            }
            
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteGoalAsync(int id)
        {
            await _unitOfWork.Goals.DeleteAsync(id);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private GoalDto MapToDto(Goal goal)
        {
            var progressPercentage = goal.TargetValue > 0 
                ? (double)goal.CurrentValue / goal.TargetValue * 100 
                : 0;

            return new GoalDto
            {
                GoalId = goal.GoalId,
                UserId = goal.UserId,
                TargetValue = goal.TargetValue,
                CurrentValue = goal.CurrentValue,
                ResetDate = goal.ResetDate,
                ProgressPercentage = Math.Min(progressPercentage, 100),
                IsCompleted = goal.CurrentValue >= goal.TargetValue
            };
        }
    }
}