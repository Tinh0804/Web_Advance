using src.Domain.Entities;

namespace src.Application.Interfaces
{
    public interface IUserProfileService
    {
        Task<UserProfile?> GetByIdAsync(int userId);
        Task<IEnumerable<UserProfile>> GetAllAsync();
        Task AddAsync(UserProfile profile);
        Task UpdateAsync(UserProfile profile);
        Task DeleteAsync(int userId);
        Task<UserProfile> GetUserProfileByAccountIdAsync(string accountId);
    }
}