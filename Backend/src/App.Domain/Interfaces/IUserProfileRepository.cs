using src.Domain.Entities;

namespace src.Domain.Interfaces
{
    public interface IUserProfileRepository : IRepository<UserProfile>
    {
        Task<UserProfile?> GetUserProfileByAccountIdAsync(string accountId);
    }
}